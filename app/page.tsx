import { StaticLedSign } from '@/components/led-sign'
import { ScrollingLedSign } from '@/components/scrolling-led-sign'

export default function Home() {
  return (
    <main className='min-h-screen w-screen p-4 flex flex-col items-center justify-center gap-6'>
      <div className='flex flex-col items-center justify-center gap-2 rounded-full bg-black p-8 my-9 aspect-square w-64 text-center'>
        <h1 className='text-3xl font-bold text-amber-500'>
          a collection of quotes by jenny holzer
        </h1>
      </div>
      <div className='relative w-full max-w-[600px] flex flex-col gap-4'>
        <StaticLedSign
          lines={['expiring for love', 'is beautiful', 'but stupid']}
        />
        <ScrollingLedSign text='IT IS IN YOUR SELF-INTEREST TO FIND A WAY TO BE VERY TENDER. ' />
        <StaticLedSign
          lines={['A SENSE OF', 'TIMING IS THE', 'MARK OF A GENIUS']}
        />
        <ScrollingLedSign text='At times inactivity is preferable to mindless functioning. ' />
        <StaticLedSign lines={['YOUR BODY', 'IS A', 'BATTLEGROUND']} />
        <ScrollingLedSign text='Raise boys and girls the same way.' />
        <StaticLedSign
          lines={['KNOWING YOURSELF', 'LETS YOU', 'UNDERSTAND OTHERS']}
        />
        <ScrollingLedSign text='Expressing anger is necessary. ' />
        <StaticLedSign lines={['PROTECT ME', 'FROM WHAT', 'I WANT']} />
        <ScrollingLedSign text='Turn soft and lovely anytime you have the chance.' />
        <StaticLedSign lines={['ABUSE OF POWER', 'COMES AS', 'NO SURPRISE']} />
        <ScrollingLedSign text='lack of charisma can be fatal. ' />
      </div>
    </main>
  )
}
