import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { API_PATHS } from '../../utils/apiPaths'
import axoisInstance from '../../utils/axiosInstance'
import ExpenseOverview from '../../components/expense/ExpenseOverview'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/expense/AddExpenseForm'
import toast from 'react-hot-toast'
import ExpenseList from '../../components/expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'

const Expense = () => {
    useUserAuth()


    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    })

    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)

    const fetchExpenseDetails = async () => {
        if (loading) return

        setLoading(true)

        try {
            const response = await axoisInstance.get(
                `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
            )

            if (response.data) {
                setExpenseData(response.data)
            }
        } catch (err) {
            console.log("Something went wrong please try again", err)
        } finally {
            setLoading(false)
        }
    }


    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense;


        if (!category || !category.trim()) {
            toast.error("Category is required");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be valid number grater than zero");
            return;
        }

        if (!date) {
            toast.error("Date is required");
            return;
        }

        try {
            await axoisInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category,
                amount,
                date,
                icon
            })

            setOpenAddExpenseModal(false)
            toast.success("Expense added successfully")
            fetchExpenseDetails()
        } catch (err) {
            console.error(
                "Error adding expense:",
                err.response?.data?.message || err.message
            )
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axoisInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense details deleted successfully")
            fetchExpenseDetails()
        } catch (error) {
            console.error(
                "Error deleting expense",
                error.response?.data?.message || error.message
            )
        }
    }

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axoisInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType: "blob",
                }
            )

            // Create download URL directly from blob
            const url = window.URL.createObjectURL(response.data)

            const link = document.createElement("a")
            link.href = url
            link.download = "expense_details.xlsx"

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.error("Error downloading expense details:", error)
            toast.error("Failed to download expense details. Please try again.")
        }
    }

    useEffect(() => {
        fetchExpenseDetails()

        return () => { }
    }, [])



    return (
        <DashboardLayout activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpenseAdd={() => setOpenAddExpenseModal(true)}
                        />
                    </div>

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id })
                        }}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>

                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense"
                >
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense details?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>

            </div>
        </DashboardLayout>
    )
}

export default Expense
