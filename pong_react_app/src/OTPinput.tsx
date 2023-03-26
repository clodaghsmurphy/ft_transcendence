import React from 'react';
import './stats.css';
import { useMemo } from 'react';

export type OTPProps={
	value: string,
	valueLength: number,
	onChange: (value:string) => void
}

const RE_DIGIT = new RegExp(/^\d+$/);

function OTPinput({value, valueLength, onChange}:OTPProps) {
	const valueItems = useMemo(() => {
	const valueArray = value.split('');
	const items: Array<string> = [];

	for (let i = 0; i < valueLength; i++) {
		const char = valueArray[i];

		if (RE_DIGIT.test(char))
			items.push(char);
		else
			items.push('');
		
		return items;
	}

	}, [value, valueLength])
	return (
		<>
			{valueItems.map((digit, idx) => (
				<input
					key={idx}
					type="text"
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="\d{1}"
					maxLength={valueLength}
					className="otp-input"
					value={digit}
				/>
			))}
		</>
	)
}

export default OTPinput;