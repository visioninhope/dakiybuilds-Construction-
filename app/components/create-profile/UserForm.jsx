import React, { useRef, useState } from "react"
import HorizontalLine from "../utils/HorizontalLine"
import { renderInputField } from "./RenderFields"
import { initialUserFormData } from "./initialFormData"
import { useRouter } from "next/navigation"
import { profileTable } from "./supabaseTables"

function UserForm({ activateUserForm }) {
    const router = useRouter()
    const [userFormData, setUserFormData] = useState(initialUserFormData)
    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const inputRefs = {
        firstName: useRef(),
        lastName: useRef(),
        profession: useRef(),
        tel: useRef(),
    }

    const validateForm = () => {
        const errors = {}

        // Validate firstName
        if (!userFormData.firstName) {
            errors.firstName = "First name is required"
        }

        // Validate lastName
        if (!userFormData.lastName) {
            errors.lastName = "Last name is required"
        }

        // Validate profession
        if (!userFormData.profession) {
            errors.profession = "Profession is required"
        }

        // Validate tel
        if (!userFormData.tel) {
            errors.tel = "Mobile number is required"
        } else if (!/^\d{10}$/.test(userFormData.tel)) {
            errors.tel = "Invalid telephone format, should be 10 digits e.g. (8051551565)"
        }

        setFormErrors(errors)

        return Object.keys(errors).length === 0
    }

    const handleSubmission = async (event) => {
        const { firstName, lastName, profession, tel } = userFormData
        event.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            // save the data to the profiles table
            const profileError = await profileTable(firstName, lastName, profession, tel)
            const profileErrorMessage = profileError?.message

            if (!profileErrorMessage) {
                setIsLoading(false)
                window.account_creation_modal.showModal()
                router.push("/dakiyboard")
            } else {
                setIsLoading(false)
                alert(profileErrorMessage)
            }
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setUserFormData({
            ...userFormData,
            [name]: value,
        })
    }

    return (
        <section className={`${activateUserForm ? "block" : "hidden"}`}>
            <form
                className="mx-auto my-4 flex w-11/12 flex-col rounded-lg bg-base-200 p-8 font-Raleway text-xs font-semibold uppercase text-primary-content/50 shadow-lg shadow-base-300 md:text-lg md:font-bold"
                noValidate
                onSubmit={handleSubmission}
            >
                <h2 className="mb-3 font-bold text-primary-focus md:text-lg">Your Details (Step 2 of 2)</h2>
                <HorizontalLine />

                {renderInputField(
                    "firstName",
                    "Your first name",
                    "text",
                    userFormData,
                    handleInputChange,
                    inputRefs.firstName,
                    formErrors.firstName
                )}

                {renderInputField(
                    "lastName",
                    "Your last name",
                    "text",
                    userFormData,
                    handleInputChange,
                    inputRefs.lastName,
                    formErrors.lastName
                )}

                {renderInputField(
                    "profession",
                    "Your profession / occupation",
                    "text",
                    userFormData,
                    handleInputChange,
                    inputRefs.profession,
                    formErrors.profession
                )}

                {renderInputField(
                    "tel",
                    "Your mobile number",
                    "tel",
                    userFormData,
                    handleInputChange,
                    inputRefs.tel,
                    formErrors.tel
                )}
                <button className="btn btn-success w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-dots loading-lg"></span> : "Create Profile"}
                </button>
            </form>
        </section>
    )
}

export default UserForm
