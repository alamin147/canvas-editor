import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { FiImage } from "react-icons/fi";
import { CustomFormFields } from "../register/Register";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Initialize form
  const form = useForm({
    defaultValues: {
      username: "admin",
      password: "123456",
    },
  });

  // Handle form submission
  const onSubmit = async (values: any) => {
    try {
      const response = await loginUser(values).unwrap();
      console.log(response);
      if (response.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(
          response?.data?.message
            ? response?.data?.message
            : "Something went wrong, please try again."
        );
        return;
      }
    } catch (error: any) {
      // console.log(error);
      toast.error(
        error?.data?.message
          ? error?.data?.message
          : "Something went wrong, please try again."
      );
      console.error("Login error:", error);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "johndoe",
      type: "text",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "••••••••",
      type: "password",
    },
  ];
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md mb-4">
              <FiImage className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {fields.map((f) => (
                <CustomFormFields
                  form={form}
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  placeholder={f.placeholder}
                  type={f.type}
                />
              ))}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="mt-4 text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
