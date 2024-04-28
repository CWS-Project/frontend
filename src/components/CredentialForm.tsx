import { Dispatch, SetStateAction } from 'react'

type Props = {
    password: string;
    cPassword: string;
    setPassword: Dispatch<SetStateAction<string>>;
    setCPassword: Dispatch<SetStateAction<string>>;
}

const CredentialForm = ({password, cPassword, setPassword, setCPassword}: Props) => {
  return (
    <div className="flex flex-col space-y-3">
        <div className="flex flex-col w-full space-y-1">
            <label htmlFor="password">Password</label>
            <input placeholder="****" className="rounded-lg p-2 shadow-md" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex flex-col w-full space-y-1">
            <label htmlFor="cpassword">Confirm Password</label>
            <input placeholder="****" className="rounded-lg p-2 shadow-md" type="password" id="cpassword" name="cpassword" value={cPassword} onChange={(e) => setCPassword(e.target.value)} />
        </div>
    </div>
  )
}

export default CredentialForm