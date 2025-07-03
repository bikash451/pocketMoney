import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineWarning } from "react-icons/md";
import { toast } from "sonner";

import DialogWrapper from "../components/ui/wrappers/dialog-wrapper";
import Loading from "../components/loading";
import Input from "../components/ui/input"; 
import {Button} from "../components/ui/button"; 
import useStore from "../store/index"; 
import api from "../libs/apiCalls";
import { formatCurrency } from "../libs/index"; 
const TransferMoney = ({ isOpen, setIsOpen, refetch }) => {
    const { user } = useStore((state) => state); 
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [fromAccountInfo, setFromAccountInfo] = useState(null);
    const [toAccountInfo, setToAccountInfo] = useState(null);

    const submitHandler = async (data) => {
        try {
            setLoading(true);
            const newData = {
                ...data,
                from_account: fromAccountInfo.id,
                to_account: toAccountInfo.id,
            };

            const { data: res } = await api.put(
                `/transaction/transfer-money`,
                newData
            );

            if (res?.status == "success") {
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

    const getAccountBalance = (setAccount, val) => {
        const filteredAccount = accountData?.find(
            (account) => account.account_name === val
        );
        setAccount(filteredAccount);
    };

    function closeModal() {
        setIsOpen(false);
    }

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const { data: res } = await api.get(`/account`);
            setAccountData(res?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-200  00 p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-900 mb-4 uppercase'
                >
                    Transfer Money
                </DialogTitle>

                {isLoading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='flex flex-col gap-1 mb-4'>
                            <p className='text-gray-700 dark:text-gray-400 text-sm mb-2'>
                                From Account
                            </p>
                            <select
                                defaultValue=""
                                onChange={(e) => getAccountBalance(setFromAccountInfo, e.target.value)}
                                className='inputStyles'
                            >
                                <option
                                    value=""
                                    disabled
                                    className='w-full flex items-center justify-center dark:bg-slate-900'
                                >
                                    Select Account
                                </option>
                                {accountData?.map((acc, index) => (
                                    <option
                                        key={index}
                                        value={acc?.account_name}
                                        className='w-full flex items-center justify-center dark:bg-slate-900'
                                    >
                                        {acc?.account_name} {" - "}
                                        {formatCurrency(acc?.account_balance)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1 mb-4'>
                            <p className='text-gray-700 dark:text-gray-400 text-sm mb-2'>
                                To Account
                            </p>
                            <select
                                defaultValue=""
                                onChange={(e) => getAccountBalance(setToAccountInfo, e.target.value)}
                                className='inputStyles'
                            >
                                <option
                                    value=""
                                    disabled
                                    className='w-full flex items-center justify-center dark:bg-slate-900'
                                >
                                    To Account
                                </option>
                                {accountData?.map((acc, index) => (
                                    <option
                                        key={index}
                                        value={acc?.account_name}
                                        className='w-full flex items-center justify-center dark:bg-slate-900'
                                    >
                                        {acc?.account_name} {" - "}
                                        {formatCurrency(acc?.account_balance)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {fromAccountInfo?.account_balance <= 0 && (
                            <div className='flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded'>
                                <MdOutlineWarning size={30} />
                                <span className='text-sm'>
                                     Insufficient account balance.
                                </span>
                            </div>
                        )}

                        {fromAccountInfo?.account_balance > 0 && toAccountInfo?.id && (
                            <div>
                                <Input
                                    type="number"
                                    name="amount"
                                    label="Amount"
                                    placeholder="100.00"
                                    {...register("amount", {
                                        required: "Transaction amount is required!",
                                        min: {
                                            value: 0.01,
                                            message: "Amount must be greater than 0"
                                        },
                                        max: {
                                            value: fromAccountInfo?.account_balance,
                                            message: `Amount cannot exceed ${formatCurrency(fromAccountInfo?.account_balance)}`
                                        }
                                    })}
                                    error={errors.amount ? errors.amount.message : ""}
                                />

                                <div className="w-full mt-8">
                                    <Button
                                        disabled={loading}
                                        type="submit"
                                        className="bg-violet-700 text-white w-full"
                                    >
                                        Transfer {watch("amount") ? formatCurrency(watch("amount")) : ""}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </DialogPanel>
        </DialogWrapper>
    );
};

export default TransferMoney;

