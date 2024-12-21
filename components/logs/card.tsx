import React from 'react';

const LogCard = () => {
	return (
		<div className='flex flex-col gap-2 hover:opacity-75 cursor-pointer'>
			<div className='bg-muted rounded-md aspect-video mb-4'></div>
			<h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
			<p className='text-muted-foreground text-base'>
				Our goal is to streamline SMB trade, making it easier and faster
				than ever.
			</p>
		</div>
	);
};

export default LogCard;
