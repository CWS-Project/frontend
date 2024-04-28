import { Dispatch, SetStateAction } from "react";

type Props = {
    firstName: string;
    setFirstName: Dispatch<SetStateAction<string>>;
    lastName: string;
    setLastName: Dispatch<SetStateAction<string>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    phone: string;
    setPhone: Dispatch<SetStateAction<string>>;
}

const BasicDetailForm = ({firstName, lastName, email, phone, setFirstName, setLastName, setEmail, setPhone}: Props) => {
  return (
    <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-4">
            <div className="flex flex-col w-full space-y-1">
                <label htmlFor="first_name">First Name</label>
                <input placeholder="John" className="rounded-lg p-2 shadow-md" type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="flex flex-col w-full space-y-1">
                <label htmlFor="last_name">Last Name</label>
                <input placeholder="Doe" className="rounded-lg p-2 shadow-md" type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
        </div>
        <div className="flex flex-col w-full space-y-1">
            <label htmlFor="email">Email</label>
            <input className="rounded-lg p-2 shadow-md" placeholder="Email" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col w-full space-y-1">
            <label htmlFor="phone">Mobile No</label>
            <input className="rounded-lg p-2 shadow-md" placeholder="+XX-XXXXXXXXXX" type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
    </div>
  )
}

export default BasicDetailForm