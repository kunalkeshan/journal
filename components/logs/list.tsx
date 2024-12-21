import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogCard from './card';

export const Blog1 = () => (
	<div className='w-full py-20 lg:py-40'>
		<div className='container mx-auto flex flex-col gap-14'>
			<div className='flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8'>
				<h4 className='text-3xl md:text-5xl tracking-tighter max-w-xl font-regular'>
					Latest articles
				</h4>
				<Button className='gap-4'>
					View all articles <MoveRight className='w-4 h-4' />
				</Button>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
				<LogCard />
				<LogCard />
				<LogCard />
				<LogCard />
			</div>
		</div>
	</div>
);
