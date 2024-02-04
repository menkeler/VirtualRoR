import React, { useState } from 'react';
import client from '../../../api/client';
import Cookies from 'js-cookie';

const ManualUserCreation = ({ onUserIdChange }) => {

    const initialFormState = {
        first_name: '',
        last_name: '',
        email: '',
        contact: '',
        department: '',
    };

    const [form, setForm] = useState(initialFormState);

    const resetForm = () => {
        setForm(initialFormState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
         setForm({
                ...form,
                [name]: value.trim(),
         });

    };


    const handleUserRegistration = async (e) => {
        e.preventDefault();

        if (!form.first_name || !form.last_name || !form.email || !form.contact || !form.department) {
            alert('All fields are required. Please complete the form.');
            return;
        }
        try {
           
            //Append Addu.edu.ph email here
            const updatedForm = {
                ...form,
                email: form.email.endsWith('@addu.edu.ph') ? form.email : form.email + '@addu.edu.ph',
            };
            //check if already registered if not it will not proceed a
           const res = await client.post('users/users/checkregister/', updatedForm);

           if (res.status === 200) {
            // User already registered
            alert('Email is already registered.');
            
            }
            else{
              console.log('form sent',updatedForm)

              const registrationResponse = await client.post('users/users/register/', updatedForm);

              onUserIdChange(registrationResponse.data);

              document.getElementById('Register_User').close();
              resetForm();
            }
          
        } catch (error) {
      
            console.error('Error:', error);
            
        }
    }
 
    return (
        <>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn" onClick={()=>document.getElementById('Register_User').showModal()}>New User</button>




        <dialog id="Register_User" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Register!</h3>
        
                <div className="mb-5">
                 <h2 className="text-base font-bold mb-2 text-left">First Name</h2>
                    <input
                        type="text"
                        placeholder="Please Enter First Name (required)"
                        className="input input-bordered w-full bg-white"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-5">
                 <h2 className="text-base font-bold mb-2 text-left">Last Name</h2>
                    <input
                        type="text"
                        placeholder="Please Enter Last Name (required)"
                        className="input input-bordered w-full bg-white"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-5">
                 <h2 className="text-base font-bold mb-2 text-left">Email</h2>
                 <div className="flex items-start">
                    <input
                        type="text"
                        placeholder="Please Enter email (required)"
                        className="input input-bordered flex-grow bg-white"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                    />
                    <span className="ml-2 text-3xl font-bold">@addu.edu.ph</span>
                </div>
                </div>

                <div className="mb-5">
                 <h2 className="text-base font-bold mb-2 text-left">Contact</h2>
                    <input
                        type="text"
                        placeholder="Please Enter contact (required)"
                        className="input input-bordered w-full bg-white"
                        name="contact"
                        value={form.contact}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-5">
                <h2 className="text-base font-bold mb-2 text-left">Department</h2>
                <select
                    className="input input-bordered w-full bg-white"
                    name="department"
                    value={form.department}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Select Department</option>
                    {/* AddMore if dont want drop box just change later */}
                    <option value="CS">CS</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>  

       
            <div className="modal-action">
            <form method="dialog">
                
                <button className='btn button-accent' onClick={handleUserRegistration} type="submit">Submit</button>
                <button className="btn" onClick={resetForm}>Close</button>
            </form>
            </div>
        </div>
        </dialog>
        
           
       
        </>
    );
}

export default ManualUserCreation;
