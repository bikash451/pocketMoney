import React, { useState } from "react";
import useStore from "../store";
import { useForm } from "react-hook-form";
// import { generateAccountNumber } from "../libs";
import DialogWrapper from "./ui/wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle} from "@headlessui/react";
import Input from "./ui/input";
import {MdOutlineWarning } from "react-icons/md"
import {Button} from "./ui/button"
import { BiLoader } from "react-icons/bi";
import api from "../libs/apiCalls";
import {toast } from "sonner"


const accounts = ["Cash", "Online", "Other"];

export const AddAccount = ({ isOpen, setIsOpen, refetch }) => {
    const { user } = useStore((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { }, // account_number: generateAccountNumber()
    });
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
    try {
        setLoading(true);
        const newData = { ...data, name: selectedAccount };

        const { data: res } = await api.post(`/account/create`, newData);
        if (res?.data) {
            toast.success(res?.message);
            setIsOpen(false);
            refetch();
        }
    } catch (error) {
        console.error("Something went wrong:", error);
        toast.error(error?.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
};

    function closeModal() {
        setIsOpen(false);
    }

 return (
  <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-300 p-6 text-left align-middle shadow-xl transition-all">
      <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-800 mb-4 uppercase">
        Add Account
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-1 mb-2">
          <p className="text-gray-900 dark:text-gray-800 text-sm mb-2">
            Select Account
          </p>
          <select
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="bg-transparent appearance-none border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none focus:ring-1 ring-blue-500 dark:placeholder:text-gray-700"
          >
            {accounts.map((acc, index) => (
              <option
                key={index}
                value={acc}
                className="w-full flex items-center justify-center dark:bg-slate-900"
              >
                {acc}
              </option>
            ))}
          </select>

          {user?.accounts?.includes(selectedAccount) && (
            <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
              <MdOutlineWarning size={30} />
              <span className="text-sm">
                This account has already been activated. Try another one.
              </span>
            </div>
          )}

          {!user?.accounts?.includes(selectedAccount) && (
            <>
              <Input
                name="account_number"
                label="Account Number"
                placeholder="1"
                {...register("account_number", {
                  required: "Account Number is required!",
                  validate: (value) => {
                    const existingAccountNumbers = user?.accounts?.map(acc => acc.account_number) || [];
                    

                    if (existingAccountNumbers.includes(value)) {
                      toast.error("Account number already taken. Please choose a different number.");
                      return "Account number already exists. Please choose a different number.";
                    }
                    return true;
                  }
                })}
                error={errors.account_number ? errors.account_number.message : ""}
                className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-gray-800 dark:outline-none"
              />

              <Input
                name="amount"
                label="Amount"
                placeholder="1000.00"
                {...register("amount", {
                  required: "Initial Amount is required!",
                })}
                error={errors.amount ? errors.amount.message : ""}
                className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-gray-800 dark:outline-none"
              />

              <Button
                disabled={loading}
                type="submit"
                className="bg-violet-700 text-white w-full mt-4"
              >
                {loading ? (
                  <BiLoader className="text-xl animate-spin text-white" />
                ) : (
                  "Create account"
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </DialogPanel>
  </DialogWrapper>
);
};