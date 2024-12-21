import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import getLatestMarkdownFiles from '@/lib/get-latest-md-files';
import { dateFormatter } from '@/lib/utils';

interface Props extends React.HTMLProps<typeof Link> {
	log: Awaited<ReturnType<typeof getLatestMarkdownFiles>>[number];
}

const LogCard: React.FC<Props> = ({ log }) => {
	return (
		<Link
			href={`/logs/${log?.slug}`}
			className='flex flex-col gap-2 hover:opacity-75 cursor-pointer'
			prefetch={false}
		>
			<div className='bg-muted rounded-md mb-4'>
				<Image
					src={log?.image}
					alt={log?.frontmatter?.title ?? 'Log Image'}
					width={400}
					height={200}
					className='rounded-md w-full h-auto object-fit'
				/>
			</div>
			<h3 className='text-xl tracking-tight'>
				{log?.frontmatter?.title}
			</h3>
			<p className='text-muted-foreground text-base line-clamp-2'>
				{log?.frontmatter?.description}
			</p>
			{log?.frontmatter?.date && (
				<p className='text-muted-foreground text-sm'>
					{dateFormatter(log?.frontmatter?.date)}
				</p>
			)}
		</Link>
	);
};

export default LogCard;
