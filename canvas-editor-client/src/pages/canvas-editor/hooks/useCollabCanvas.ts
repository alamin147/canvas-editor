import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/provider/SocketProvider';
import { toast } from 'react-hot-toast';
import { Canvas as FabricCanvas } from 'fabric';
import {util} from 'fabric';
import { useGetMeQuery } from '@/redux/features/user/userApi';
import { useAddContributorMutation } from '@/redux/features/project/projectApi';

interface CollaboratorUser {
  socketId: string;
  userId: string;
  username: string;
  userColor: string;
  mousePosition: { x: number, y: number };
  isOnline?: boolean;
  activeObjectId?: string | null;
}

type CanvasOperation = 'add' | 'modify' | 'delete';

interface UseCollabCanvasProps {
  projectId: string | undefined;
  canvas: FabricCanvas | null;
}

export const useCollabCanvas = ({ projectId, canvas }: UseCollabCanvasProps) => {
  const { socket, isConnected } = useSocket();
    const { data } = useGetMeQuery(undefined);
const user = data?.data;
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const throttleRef = useRef<number | null>(null);
  const lastObjectUpdates = useRef(new Map<string, number>());

  // Generate a random color for this user
  const userColorRef = useRef<string>(
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  );

  // Join canvas when connected
  useEffect(() => {
    if (!socket || !isConnected || !projectId || !canvas || !user) return;

    const joinCanvas = () => {
      socket.emit('join-canvas', {
        projectId,
        userId: user.id,
        username: user.username || user.email?.split('@')[0] || 'Anonymous',
        userColor: userColorRef.current
      });

      console.log(`Joined canvas ${projectId}`);
    };

    joinCanvas();

    // Event listeners for collaboration
    const handleUserJoined = (userData: CollaboratorUser) => {
      toast.success(`${userData.username} joined the canvas`);
      setCollaborators(prev => [...prev, { ...userData, isOnline: true }]);
    };

    const handleUserLeft = ({ socketId }: { socketId: string }) => {
      setCollaborators(prev => {
        const user = prev.find(u => u.socketId === socketId);
        if (user) {
          toast.success(`${user.username} left the canvas`);
        }
        return prev.filter(u => u.socketId !== socketId);
      });
    };

    const handleActiveUsers = (users: CollaboratorUser[]) => {
      // Filter out current user from the list
      const filteredUsers = users.filter(u => u.socketId !== socket.id);
      setCollaborators(filteredUsers.map(u => ({ ...u, isOnline: true })));
    };

    const handleUserMouseMove = ({ socketId, position }: { socketId: string, position: { x: number, y: number } }) => {
      setCollaborators(prev =>
        prev.map(user =>
          user.socketId === socketId
            ? { ...user, mousePosition: position }
            : user
        )
      );
    };

    const handleCanvasUpdate = ({
      socketId,
      operation,
      object,
      objectId
    }: {
      socketId: string,
      userId: string,
      operation: CanvasOperation,
      object: any,
      objectId: string
    }) => {
      // Prevent processing our own updates that come back from the server
      if (socketId === socket.id) return;

      // Prevent duplicate rapid updates
      const now = Date.now();
      const lastUpdate = lastObjectUpdates.current.get(objectId) || 0;
      if (now - lastUpdate < 100) return; // Ignore updates less than 100ms apart
      lastObjectUpdates.current.set(objectId, now);

      try {
        switch (operation) {
          case 'add':
            // Add new object from another user
            // @ts-ignore
            util.enlivenObjects([object], function(enlivenedObjects:any){
              const fabricObject = enlivenedObjects[0];
              fabricObject.set({
                id: objectId,
                _fromOtherUser: true // Mark this object as coming from another user
              });
              canvas.add(fabricObject);
              canvas.renderAll();
              console.log(`Added object from another user: ${objectId}`);
            });
            break;

          case 'modify':
            // Update an existing object
            const existingObj = canvas.getObjects().find((obj: any) => obj.id === objectId);
            if (existingObj) {
              // Don't update if we're currently editing this object
              if (existingObj === canvas.getActiveObject()) return;

              existingObj.set(object);
              existingObj.setCoords();
              canvas.renderAll();
            }
            break;

          case 'delete':
            // Remove an object
            const objToRemove = canvas.getObjects().find((obj: any) => obj.id === objectId);
            if (objToRemove) {
              canvas.remove(objToRemove);
              canvas.renderAll();
            }
            break;
        }

        const userWhoChanged = collaborators.find(u => u.socketId === socketId);
        if (userWhoChanged) {
          // Update the user's cursor - could show a small animation or feedback
          console.log(`Canvas updated by ${userWhoChanged.username}`);
        }
      } catch (error) {
        console.error('Error handling canvas update:', error);
      }
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('active-users', handleActiveUsers);
    socket.on('user-mouse-move', handleUserMouseMove);
    socket.on('canvas-update', handleCanvasUpdate);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('active-users', handleActiveUsers);
      socket.off('user-mouse-move', handleUserMouseMove);
      socket.off('canvas-update', handleCanvasUpdate);
    };
  }, [socket, isConnected, projectId, canvas, user]);

  // Set up mouse movement tracking
  useEffect(() => {
    if (!canvas || !socket || !isConnected || !projectId) return;

    const handleCanvasMouseMove = (e: any) => {
      if (!socket || !projectId) return;

      // Throttle mouse position updates
      if (throttleRef.current !== null) return;

      throttleRef.current = window.setTimeout(() => {
        const pointer = canvas.getPointer(e.e);
        socket.emit('mouse-move', {
          projectId,
          position: { x: pointer.x, y: pointer.y }
        });
        throttleRef.current = null;
      }, 50);
    };

    // Add event listener for mouse movement
    canvas.on('mouse:move', handleCanvasMouseMove);

    return () => {
      canvas.off('mouse:move', handleCanvasMouseMove);
      if (throttleRef.current !== null) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [canvas, socket, isConnected, projectId]);

  useEffect(() => {
    if (!canvas || !socket || !isConnected || !projectId) return;

    const sendObjectUpdate = (operation: CanvasOperation, obj: any) => {
      if (!socket || !projectId) return;

      try {
        if (!obj.id) {
          obj.id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log(`Assigned ID to object: ${obj.id}`);
        }

        // Create a simplified object to send over the network
        const simplifiedObj = obj.toObject(['id', 'type', 'left', 'top', 'width', 'height', 'fill',
          'stroke', 'strokeWidth', 'radius', 'scaleX', 'scaleY', 'angle', 'text', 'fontSize',
          'fontFamily', 'x1', 'y1', 'x2', 'y2']);

        socket.emit('canvas-update', {
          projectId,
          operation,
          objectId: obj.id,
          object: simplifiedObj
        });

        // Save timestamp of this update
        lastObjectUpdates.current.set(obj.id, Date.now());
      } catch (error) {
        console.error('Error sending object update:', error);
      }
    };

    const handleObjectAdded = (e: any) => {
      const obj = e.target;
      if (obj && !obj._fromOtherUser) {
        if (obj._onInitialLoad) return;
        sendObjectUpdate('add', obj);
      }
    };

    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (obj && !obj._fromOtherUser) {
        sendObjectUpdate('modify', obj);
      }
    };

    const handleObjectRemoved = (e: any) => {
      const obj = e.target;
      if (obj && obj.id && !obj._fromOtherUser) {
        socket.emit('canvas-update', {
          projectId,
          operation: 'delete',
          objectId: obj.id,
          object: null
        });
      }
    };

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, socket, isConnected, projectId]);

  // Function to invite a user
  const [addContributor] = useAddContributorMutation();

  const inviteUserToProject = async (email: string) => {
    if (!projectId) {
      toast.error('Project ID is missing');
      return false;
    }

    try {
      await addContributor({ projectId, email }).unwrap();
      toast.success(`Invitation sent to ${email}`);

      setCollaborators(prev => [
        ...prev,
        {
          socketId: `invited-${Date.now()}`,
          userId: `invited-${Date.now()}`,
          username: email,
          userColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
          mousePosition: { x: 0, y: 0 },
          isOnline: false
        }
      ]);

      return true;
    } catch (error: any) {
      console.error('Failed to invite user:', error);

      let errorMessage = 'Failed to send invitation';
      if (error.data?.message) {
        errorMessage = error.data.message;
      }

      toast.error(errorMessage);
      return false;
    }
  };

  return { collaborators, inviteUserToProject };
};
