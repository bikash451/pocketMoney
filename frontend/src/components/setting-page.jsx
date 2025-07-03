import useStore from "../store";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Combobox, ComboboxInput, ComboboxButton, Transition, ComboboxOption,ComboboxOptions, Button } from '@headlessui/react'
import { BsChevronExpand } from 'react-icons/bs'
import {BiCheck, BiLoader } from 'react-icons/bi'
import { fetchCountries } from "../libs";
import { Fragment } from "react";
import Input from "./ui/input";
import api from "../libs/apiCalls";
import { toast } from 'sonner';


export const SettingsForm = () => {
    const { user } = useStore((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { ...user },
    });

    const [selectedCountry, setSelectedCountry] = useState(
    { country: user?.country || "", currency: user?.currency || "" }
);
    const [query, setQuery] = useState("");
    const [countriesData, setCountriesData] = useState([]);
    const [loading, setLoading] = useState(false);

    

    const onSubmit = async (values) => {
    try {
        setLoading(true);
        const newData = {
            ...values,
            country: selectedCountry.country,
            currency: selectedCountry.currency,
        };
        const { data: res } = await api.put(`/user`, newData);

        if (res?.user) {
            const newUser = { ...res.user, token: user.token };
            localStorage.setItem("user", JSON.stringify(newUser));
            toast.success(res?.message);
        }
    } catch (error) {
        console.error("Something went wrong:", error);
        toast.error(error?.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
};

    

    const filteredCountries = query === "" 
    ? countriesData 
    : countriesData.filter((country) => 
        country.country
    .toLowerCase()
    .replace(/\s+/g, "")
    .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
};

useEffect(() => {
    getCountriesList();
}, []);

    const Countries = () => {
    return (
        <div className="w-full">
            <Combobox value={selectedCountry} onChange={setSelectedCountry}>
                <div className="relative mt-1">
                    <div className="">
                        <ComboboxInput
                            className="inputStyles"
                            displayValue={(country) => country?.country}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <BsChevronExpand className="text-gray-400" />
                        </ComboboxButton>
                    </div>
                    <Transition as={Fragment}
                         leave="transition ease-in duration-100"
                         leaveFrom="opacity-100"
                         leaveTo="opacity-0"
                         afterLeave={() => setQuery("")}>

                            <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1">
        {filteredCountries.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                Nothing found.
            </div>
        ) : (
            filteredCountries?.map((country, index) => (
                <ComboboxOption
                    key={country.country + index}
                    className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                                ? "bg-violet-600/20 text-white"
                                : "text-gray-900"
                        }`
                    }
                    value={country}
                >
                    {({ selected, active }) => (
                        <>
                        <div className="flex items-center gap-2">
                            <img
                                src={country?.flag}
                                alt={country.country}
                                className='w-8 h-5 rounded-sm object-cover'
                            />
                            <span
                                className={`block truncate text-gray-700 dark:text-gray-500 ${selected ? "font-medium" :                              "font-normal"
                            }`}
                            >
                            {country?.country}
                            </span>
                            </div>
                            {selected ? (
                            <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" :                              "text-teal-600"
                            }`}
                            >
                                <BiCheck className="h-5 w-5 aria-hidden='true' " />
                            </span>
                            ) : null}
                            </>
                    )}
                </ComboboxOption>
            ))
        )}
        </ComboboxOptions>
        </Transition>
                            

                </div>
            </Combobox>
        </div>
    );
};

return <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className="w-full">
        <Input
    disabled={loading}
    id="firstname"
    label="First Name"
    type="text"
    placeholder="John"
    error={errors.firstname?.message}
    {...register("firstname")}
    className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-gray-800 dark:outline-none"
/>
        </div>
        <div className="w-full">
                <Input
    disabled={loading}
    id="lastname"
    label="Last Name"
    type="text"
    placeholder="Cena"
    error={errors.lastname?.message}
    {...register("lastname")}
    className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-gray-800 dark:outline-none"
/>
        </div>
    </div>

        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className="w-full">
    <Input
        disabled={true}
        id="email"
        label="Email"
        type="text"
        placeholder="John"
        error={errors.email?.message}
        {...register("email")}
        className="w-full text-sm border dark:border-gray-800 dark:bg-gray-100 dark:placeholder:text-gray-400 dark:text-gray-600 dark:outline-none cursor-not-allowed"
    />
</div>
        <div className="w-full">
                <Input
    disabled={loading}
    id="contact"
    label="Contact"
    type="text"
    placeholder="(+1) 080 11111"
    error={errors.contact?.message}
    {...register("contact")}
    className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-400 dark:text-gray-800 dark:outline-none"
/>
        </div>
    </div>

    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="w-full">
        <span className="labelStyles">Country</span>
    <Countries />
    </div>

<div className="w-full">
    <span className="labelStyles">Currency</span>
    <select className="inputStyles">
        <option>{selectedCountry?.currency || user?.country}</option>
    </select>
</div>
</div>

<div className="flex items-center gap-6 justify-end pb-10 border-b-2  border-gray-200 □ dark:border-gray-800">

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
        className="px-8 h-10 bg-violet-700 hover:bg-violet-800 text-white rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-70"
    >
        {loading? <BiLoader className="animate-spin text-white" /> : "Save" }
    </Button>
</div>
</form>;

};