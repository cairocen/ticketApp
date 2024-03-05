import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function TicketStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-green-600 text-white-500': status === 'abierto',
          'bg-lime-400 text-black': status === 'registrado',
          'bg-indigo-600 text-white': status === 'actualizado',
          'bg-stone-500 text-white': status === 'cerrado',
        },
      )}
    >
      {status === 'abierto' ? (
        <>
          Abierto
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'registrado' ? (
        <>
          Registrado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'actualizado' ? (
        <>
          Actualizado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'cerrado' ? (
        <>
          Cerrado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
