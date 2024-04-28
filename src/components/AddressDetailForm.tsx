import { Dispatch, SetStateAction } from 'react'

type Props = {
    line1: string;
    setLine1: Dispatch<SetStateAction<string>>;
    line2: string;
    setLine2: Dispatch<SetStateAction<string>>;
    city: string;
    setCity: Dispatch<SetStateAction<string>>;
    state: string;
    setState: Dispatch<SetStateAction<string>>;
    country: string;
    setCountry: Dispatch<SetStateAction<string>>;
    district: string;
    setDistrict: Dispatch<SetStateAction<string>>;
    postalCode: string;
    setPostalCode: Dispatch<SetStateAction<string>>;
}

const AddressDetailForm = ({
    line1,
    line2,
    city,
    state,
    country,
    district,
    postalCode,
    setLine1,
    setLine2,
    setCity,
    setState,
    setCountry,
    setDistrict,
    setPostalCode
}: Props) => {
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-4">
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="address_line_1">Address Line 1</label>
                    <input placeholder="123, XYZ" className="rounded-lg p-2 shadow-md" type="text" id="address_line_1" name="address_line_1" value={line1} onChange={(e) => setLine1(e.target.value)} />
                </div>
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="address_line_2">Address Line 2</label>
                    <input placeholder="Sample Ave" className="rounded-lg p-2 shadow-md" type="text" id="address_line_2" name="address_line_2" value={line2} onChange={(e) => setLine2(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="city">City</label>
                    <input placeholder="City" className="rounded-lg p-2 shadow-md" type="text" id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="state">State</label>
                    <input placeholder="State" className="rounded-lg p-2 shadow-md" type="text" id="state" name="state" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="postal_code">Postal Code</label>
                    <input placeholder="000000" className="rounded-lg p-2 shadow-md" type="text" id="postal_code" name="postal_code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="district">District</label>
                    <input placeholder="District" className="rounded-lg p-2 shadow-md" type="text" id="district" name="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-col w-full space-y-1">
                    <label htmlFor="country">Country</label>
                    <input placeholder="Country" className="rounded-lg p-2 shadow-md" type="text" id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
        </div>
    )
}

export default AddressDetailForm