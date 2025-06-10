import { useEffect, useRef } from 'react';
import { Canvas, util } from 'fabric';
import { Socket } from 'socket.io-client';
// Custom hook to handle canvas object synchronization across clients
export const useCanvasSync = (
  canvas: Canvas | null,
  socket: Socket | null,
  projectId: string | undefined,
  isConnected: boolean
) => {
    // @ts-ignore
  const syncedObjects = useRef(new Map<string, boolean>());
  const initialLoadComplete = useRef(false);
  const debounceTimers = useRef(new Map<string, NodeJS.Timeout>());

  // Handle fabric object ID generation
  const generateObjectId = () => {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Ensure all objects have IDs
  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj:any) => {
      if (!obj.data?.id) {
        obj.data = obj.data || {};
        obj.data.id = generateObjectId();
      }
    });
  }, [canvas]);

  // Set up listeners for canvas events that should be synchronized
  useEffect(() => {
    if (!canvas || !socket || !isConnected || !projectId) return;

    // Mark initial load as complete after a delay
    const initialLoadTimer = setTimeout(() => {
      initialLoadComplete.current = true;
      console.log('Initial canvas load complete, sync enabled');
    }, 1500);

    // Function to send object update to other clients
    const sendObjectUpdate = (type: 'add' | 'modify' | 'remove', obj: any) => {
      if (!initialLoadComplete.current) return;

      // Ensure the object has a unique ID
      if (!obj.data?.id) {
        obj.data = obj.data || {};
        obj.data.id = generateObjectId();
      }

      const objectId = obj.data.id;

      // Clear any pending debounce timer for this object
      if (debounceTimers.current.has(objectId)) {
        clearTimeout(debounceTimers.current.get(objectId));
      }

      // Debounce updates to avoid spamming the network
      debounceTimers.current.set(objectId, setTimeout(() => {
        try {
          const objectData = type !== 'remove' ? obj.toJSON(['data']) : null;

          console.log(`Sending ${type} for object ${objectId}`);
          socket.emit('canvas-update', {
            projectId,
            operation: type,
            objectId,
            object: objectData
          });
        } catch (error) {
          console.error('Error sending object update:', error);
        }
      }, 100)); // Debounce for 100ms
    };

    // Handler for when an object is added to canvas
    const handleObjectAdded = (e: any) => {
      const obj = e.target;
      if (obj && !obj.data?.syncedFrom) {
        sendObjectUpdate('add', obj);
      }
    };

    // Handler for when an object is modified
    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (obj && !obj.data?.syncedFrom) {
        // For group selections, sync each object individually
        if (obj.type === 'activeSelection') {
          obj.getObjects().forEach((groupObj: any) => {
            sendObjectUpdate('modify', groupObj);
          });
        } else {
          sendObjectUpdate('modify', obj);
        }
      }
    };

    // Handler for when an object is removed
    const handleObjectRemoved = (e: any) => {
      const obj = e.target;
      if (obj && obj.data?.id && !obj.data?.syncedRemove) {
        sendObjectUpdate('remove', obj);
      }
    };

    // Handler for remote canvas updates
    const handleRemoteUpdate = (data: any) => {
      if (!canvas) return;

      const { operation, objectId, object, socketId } = data;

      // Skip our own updates that echo back
      if (socketId === socket.id) return;

      try {
        switch (operation) {
          case 'add':
            // @ts-ignore
            util.enlivenObjects([object], (enlivedObjects:any) =>{
                const newObj = enlivedObjects[0];

                // Mark this object as synced from another user
                newObj.data = newObj.data || {};
                newObj.data.id = objectId;
                newObj.data.syncedFrom = socketId;

                canvas.add(newObj);
                canvas.renderAll();
                console.log(`Added remote object: ${objectId}`);
            });
            break;

          case 'modify':
            const existingObj:any = canvas.getObjects().find((obj: any) =>
              obj.data?.id === objectId
            );

            if (existingObj) {
              // Skip if we're currently editing this object
              if (existingObj === canvas.getActiveObject()) return;

              // Temporarily mark to avoid echo
              existingObj.data = existingObj.data || {};
              existingObj.data.syncedFrom = socketId;

              // Update with new properties
              // @ts-ignore
              util.enlivenObjects([object], (enlivedObjects: any)=> {
                const updatedObj = enlivedObjects[0];

                // Copy all properties except for special data
                Object.keys(updatedObj).forEach(key => {
                  if (key !== 'data') {
                    existingObj[key] = updatedObj[key];
                  }
                });

                // Preserve our data and objectId
                existingObj.data.syncedFrom = socketId;

                // Update canvas and coordinates
                existingObj.setCoords();
                canvas.renderAll();
                console.log(`Updated remote object: ${objectId}`);

                // Clear the sync source after a short delay
                setTimeout(() => {
                  if (existingObj.data) {
                    delete existingObj.data.syncedFrom;
                  }
                }, 300);
              });
            }
            break;

          case 'remove':
            const objToRemove:any = canvas.getObjects().find((obj: any) =>
              obj.data?.id === objectId
            );

            if (objToRemove) {
              // Mark to avoid echo
              objToRemove.data = objToRemove.data || {};
              objToRemove.data.syncedRemove = true;

              canvas.remove(objToRemove);
              canvas.renderAll();
              console.log(`Removed remote object: ${objectId}`);
            }
            break;
        }
      } catch (error) {
        console.error('Error handling remote object update:', error);
      }
    };

    // Register event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    socket.on('canvas-update', handleRemoteUpdate);

    // Clean up
    return () => {
      clearTimeout(initialLoadTimer);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
      socket.off('canvas-update', handleRemoteUpdate);

      // Clear any pending debounce timers
      debounceTimers.current.forEach((timer) => clearTimeout(timer));
      debounceTimers.current.clear();
    };
  }, [canvas, socket, isConnected, projectId]);

  // Return nothing as this hook is for side effects only
  return null;
};
