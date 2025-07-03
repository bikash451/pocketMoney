import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner';
import api from '../libs/apiCalls';
import Loading from '../components/loading';
import Info from '../components/info';
import Stats from '../components/stats';

const Dashboard = () => {
  const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDashboardStats = async () => {
        const URL = `/transaction/dashboard`;

        try {
            setIsLoading(true);
            const { data } = await api.get(URL);
            setData(data);
        } catch (error) {
            console.error(error);
            Toaster.error(
                error?.response?.data?.message ||
                "Something unexpected happened. Try again later."
            );
            if (error?.response?.data?.status === "auth_failed") {
                localStorage.removeItem("user");
                window.location.reload();
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect( () => {
      setIsLoading(true);
      fetchDashboardStats();
    }, []);

    if(isLoading) 
      return (
    <div className='flex items-center justify-center w-full h-[80vh] '>
      <Loading />
    </div> 
    );


  return (
    <div className=" px-0 md:px-5 2xl:px-20">
        <Info title="Dashboard" subTitle="Track your finances" />
        <Stats
            dt={{
                balance: data?.availableBalance,
                income: data?.totalIncome,
                expense: data?.totalExpense,
            }}
        />
    </div>
);
};

export default Dashboard;
