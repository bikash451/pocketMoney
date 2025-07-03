import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../libs/apiCalls";
import { toast } from 'sonner';
import { Button } from "@headlessui/react";
import { BiLoader } from "react-icons/bi";
import Input from "./ui/input";


export const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = useForm();

    const [loading, setLoading] = useState(false);

    const submitPasswordHandler = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.put(`/user/change-password`, data);


            if (res?.status === "Success") {
                const successMessage = res?.message || "Password changed successfully!";
                toast.success(successMessage);
                
                reset();
            } else {
                toast.error("Failed to change password. Please try again.");
            }
            
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error?.response?.data?.message || "An error occurred while changing password");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="py-20">
        <form onSubmit={handleSubmit(submitPasswordHandler)}>
            <div className="">
                <p className="text-xl font-bold text-black mb-1">
                    Change Password
                </p>
                <span className="labelStyles">
                    This will be used to log into your account and complete high severity actions.
                </span>
            </div>

            <div className="mt-6 space-y-6">
                <Input
                    disabled={loading}
                    type="password"
                    name="currentPassword"
                    label="Current Password"
                    {...register("currentPassword", {
                        required: "Current Password is required!",
                    })}
                    error={errors.currentPassword ? errors.currentPassword.message : ""}
                />
                <Input
                    type="password"
                    disabled={loading}
                    name="newPassword"
                    label="New Password"
                    {...register("newPassword", {
                        required: "New Password is required!",
                    })}
                    error={errors.newPassword ? errors.newPassword.message : ""}
                />

                <Input
                    disabled={loading}
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    {...register("confirmPassword", {
                        required: "Confirm Password is required!",
                        validate: (val) => {
                            const { newPassword } = getValues();
                            return newPassword === val || "Passwords do not match!";
                        },
                    })}
                    error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                />
            </div>

            <div className="flex items-center gap-6 justify-end mt-5 pb-10 border-b-2  border-gray-200  dark:border-gray-800">
            
                <Button
                    variant="outline"
                    loading={loading}
                    type="reset"
                    className="px-6 h-10 bg-white dark:bg-red-500 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                    Reset
                </Button>
                <Button
                    loading={loading}
                    type="submit"
                    disabled={loading}
                    className="px-8 h-10 bg-violet-700 hover:bg-violet-800 text-white rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-70"
                >
                    {loading ? <BiLoader className="animate-spin text-white" /> : "Change Password"}
                </Button>
            </div>
        </form>
    </div>
);
};