// import { MoveRight, PhoneCall } from 'lucide-react';
// import { Button } from '../ui/button';

const Hero = () => (
	<div className='w-full'>
		<div className='container mx-auto'>
			<div className='flex gap-8 py-10 items-center justify-center flex-col px-10 lg:px-20'>
				<div>
					{/* <Button variant='secondary' size='sm' className='gap-4'>
						Read our launch article{' '}
						<MoveRight className='w-4 h-4' />
					</Button> */}
				</div>
				<div className='flex gap-4 flex-col'>
					<h1 className='text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular'>
						kunalkeshan / journal
					</h1>
					<p className='text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center'>
						Sharing my learnings, document helpful guides, and keep
						a record of various insights I come across. This space
						is dedicated to my continuous learning journey and
						serves as a valuable resource for anyone interested in
						the topics I explore.
					</p>
				</div>
				{/* <div className='flex flex-row gap-3'>
					<Button size='lg' className='gap-4' variant='outline'>
						Jump on a call <PhoneCall className='w-4 h-4' />
					</Button>
					<Button size='lg' className='gap-4'>
						Sign up here <MoveRight className='w-4 h-4' />
					</Button>
				</div> */}
			</div>
		</div>
	</div>
);

export default Hero;
