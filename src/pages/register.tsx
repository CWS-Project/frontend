import { useState } from "react";
import BasicDetailForm from "../components/BasicDetailForm";
import AddressDetailForm from "../components/AddressDetailForm";
import CredentialForm from "../components/CredentialForm";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [phone, setPhone] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [district, setDistrict] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    const [message, setMessage] = useState('');

    const steps = [
        {
            id: 1,
            title: "Basic Details",
        },
        {
            id: 2,
            title: "Address"
        },
        {
            id: 3,
            title: "Credentials"
        }
    ];

    const navigate = useNavigate();

    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(s => s + 1);
            return;
        }

        if (!firstName || !lastName || !email || !phone || !line1 || !city || !state || !country || !district || !postalCode || !password || !cPassword) {
            setMessage('Please fill in all fields');
            return;
        }

        setMessage("");
        const body = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            address: {
                line1,
                line2: line2 ? line2 : null,
                city,
                state,
                country,
                district,
                postal_code: postalCode
            },
            password
        };

        console.log("Submitting form data", body);

        const url = "http://k8s.orb.local/api/v1/auth/";

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(body)
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setLine1('');
            setLine2('');
            setCity('');
            setState('');
            setCountry('');
            setDistrict('');
            setPostalCode('');
            setPassword('');
            setCPassword('');
            setCurrentStep(1);
            
            return navigate("/login");
        } else {
            const data = await response.json();
            setMessage(data.message);
            console.log(data);
            return;
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(s => s - 1);
            return;
        }
    }

    return (
        <main className="h-screen w-screen flex space-y-8 flex-col md:flex-row items-center justify-center space-x-5">
            <div className="flex space-x-4">
                <div className="shadow w-64 bg-white rounded-lg space-y-3">
                    <div className="bg-gray-100 p-3 border-b border-gray-100">
                        <span>Steps</span>
                    </div>
                    <div className="p-3 w-full space-y-4">
                        {steps.map(step => (
                            <div key={step.id} className="flex items-center space-x-2">
                                <div className={`${currentStep === step.id ? "bg-slate-900 text-gray-50" : "bg-slate-500 text-gray-200"} py-2 rounded-full`}>
                                    <span className={`${currentStep === step.id && "font-semibold"} p-4`}>{step.id}</span>
                                </div>
                                <span className={`${currentStep === step.id ? "font-semibold" : "font-light"}`}>{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="shadow flex flex-col bg-white rounded-lg space-y-3">
                    <div className="bg-gray-100 p-3 border-b border-gray-100">
                        <h2 className="text-xl font-semibold">Register for a new Account at eCommerce Store</h2>
                    </div>
                    <div className="flex flex-col p-3 space-y-4">
                        {currentStep === 1 ? (
                            <BasicDetailForm
                            email={email}
                            firstName={firstName}
                            lastName={lastName}
                            setFirstName={setFirstName}
                            setLastName={setLastName}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            />
                        ) : currentStep === 2 ? (
                            <AddressDetailForm 
                            line1={line1}
                            line2={line2}
                            city={city}
                            state={state}
                            country={country}
                            district={district}
                            postalCode={postalCode}
                            setLine1={setLine1}
                            setLine2={setLine2}
                            setCity={setCity}
                            setState={setState}
                            setDistrict={setDistrict}
                            setPostalCode={setPostalCode}
                            setCountry={setCountry} 
                            />
                        ) : (
                            <CredentialForm 
                            password={password}
                            cPassword={cPassword}
                            setPassword={setPassword}
                            setCPassword={setCPassword} 
                            />
                        )}

                        {message && (<p className="text-center text-red-500">{message}</p>)}
                        <div className="flex justify-between">
                            {currentStep !== 1 ? (
                                <button onClick={handlePrevious} className="bg-slate-400 p-3 rounded-lg text-gray-50">Previous</button>
                            ) : (
                                <div></div>
                            )}
                            <button onClick={handleNext} className="bg-slate-900 rounded-lg text-gray-50 p-3">
                                {currentStep === 3 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default RegisterPage