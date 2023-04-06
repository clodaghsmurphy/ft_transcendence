import React from 'react';
import '../Stats/stats.css';
import { useMemo } from 'react';

export type OTPProps={
	value: string,
	valueLength: number,
	onChange: (value:string) => void
}


 function OtpInput({value, valueLength, onChange}:OTPProps) {
	const RE_DIGIT = new RegExp(/^\d+$/);


	const inputOnChange = (
		e:React.ChangeEvent<HTMLInputElement>, idx:number 
	) => {
		let val = e.target.value
		const isDigit = RE_DIGIT.test(val)
		
		if (!isDigit && val !== '') {
			return ;
		}

		val = isDigit ? val : ' ';
		let newValue = value.substring(0, idx) + val + value.substring(idx + 1);
		if (newValue.length > 6)
			newValue = newValue.substring(0, 6);
		onChange(newValue);
		if (!isDigit)
			return ;
		const nextElement = e.target.nextElementSibling as HTMLInputElement | null;	
		if (nextElement) {
			nextElement.focus();
		}
	}

	const inputOnKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		target.setSelectionRange(0, target.value.length)
		if (e.key !== 'Backspace' || target.value !== '') {
			return;
		}
			const previous = target.previousElementSibling as HTMLInputElement | null;
			if (previous)
				previous.focus();	
		
	}
			
	const valueItems = useMemo(() => {
		const valueArray = value.split('');
		const items: Array<string> = [];

		for (let i = 0; i < valueLength; i++) {
			const char = valueArray[i];
			if (RE_DIGIT.test(char))
			{
				items.push(char);
			}
			else
			{
				items.push('');
			}
		}
		 return items;
	}, [value, valueLength]);
	
	return (
		<>
			{valueItems ? valueItems.map((digit, idx) => (
				<input
					key={idx}
					type="text"
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="\d{1}"
					maxLength={valueLength}
					onChange={(e) => inputOnChange(e, idx)}
					onKeyDown={inputOnKeyDown}
					className="otp-input"
					value={digit}
				/>
			)) : null}
		</>
	);
}

export default OtpInput;