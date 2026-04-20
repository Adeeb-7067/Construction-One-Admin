import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import logo from "@/assets/logo.png"
import loginAnimation from "../../assets/Construction.json"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "../Redux/apiSlice"
import { toast } from "react-hot-toast"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function Login() {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data).unwrap();
      console.log("Login Response:", res);
      if (res.statusCode === 200 || res?.data) {
        toast.success(res.message || "Login successful!");
        localStorage.setItem('token', res?.data?.accessToken);
        localStorage.setItem('adminId', res?.data?.admin?.id);
        localStorage.setItem('admin', JSON.stringify(res?.data?.admin));
        localStorage.setItem('role', res?.data?.admin?.role);
        localStorage.setItem('permissions', JSON.stringify(res?.data?.admin?.permissions || []));
        navigate("/dashboard");
      }


    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid credentials");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-500 p-4">
      <div className="absolute top-4 right-4">
        <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8 w-full max-w-5xl"
      >
        {/* Lottie Section */}
        <div className="hidden md:flex items-center justify-center">
          <Lottie animationData={loginAnimation} className="w-[500px]" />
        </div>

        {/* Form Section */}
        <Card className="h-fit mt-20 shadow-2xl bg-gradient-to-tb from-yellow-800 to-orange-600 border-none overflow-hidden">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@example.com" 
                          {...field} 
                          disabled={isLoading}
                          className="bg-yellow-50" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...field}
                            disabled={isLoading}
                            className="bg-yellow-50 pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
