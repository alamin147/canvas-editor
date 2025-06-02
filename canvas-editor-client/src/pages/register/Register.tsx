import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { FiImage } from "react-icons/fi";

// Register form schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] =
    useRegisterUserMutation();

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "assdas",
      email: "admin@gmail.com",
      username: "admin",
      password: "123456",
      confirmPassword: "123456",
    },
  });

  // Handle form submission
  const onSubmit = async (values: RegisterFormValues) => {
    const { confirmPassword,...registerData } = values;

    if(confirmPassword !== values.password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
        const response = await registerUser(registerData).unwrap();
        if (response.success) {
            toast.success("Registration successful! Redirecting to login...");
            navigate("/login");
        }
        else{
            toast.success("Something went wrong, please try again.");
            return;
        }
    } catch (error) {
        console.error("Registration error:", error);
        toast.error("Registration failed. Please try again.");
    }
  };

  const fields = [
    { name: "name", label: "Name", placeholder: "John Doe", type: "text" },
    {
      name: "email",
      label: "Email",
      placeholder: "example@a.com",
      type: "email",
    },
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
    {
      name: "confirmPassword",
      label: "Confirm Password",
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
          <h1 className="text-3xl font-bold text-gray-800">
            Create your account
          </h1>
          <p className="mt-2 text-gray-600">
            Sign up to get started with Canvas Editor
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
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="mt-4 text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
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

export default Register;

const CustomFormFields = ({
  form,
  name,
  label,
  placeholder,
  type,
}: {
  form: any;
  name: string;
  label: string;
  placeholder: string;
  type: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              className="border-gray-200 focus-visible:ring-blue-500"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
