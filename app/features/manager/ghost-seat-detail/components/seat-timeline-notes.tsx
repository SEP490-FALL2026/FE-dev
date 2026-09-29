import { Clock3, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { figmaDetail } from '../ghost-seat-detail-demo'

export function SeatTimelineNotes({ detailed }: { detailed: boolean }) {
  const { t, i18n } = useTranslation()
  const [draft, setDraft] = useState('')
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-5 flex items-center gap-2 text-sm font-bold'>
          <Clock3 size={17} aria-hidden='true' className='text-brand-600' />
          {t('ghostDetail.timelineTitle')}
        </h2>
        {detailed ? (
          <ol className='ml-2 space-y-5 border-l-2 border-neutral-200 pl-5'>
            {figmaDetail.timeline.map((event, index) => (
              <li key={event.key} className='relative'>
                <span
                  aria-hidden='true'
                  className={`absolute top-1 -left-7 size-3 rounded-full border-2 border-white ${index === 0 ? 'bg-success' : index === 3 ? 'bg-neutral-200' : 'bg-brand-500'}`}
                />
                <p className='text-xs font-semibold'>{t(`ghostDetail.timeline.${event.key}`)}</p>
                <p className='mt-1 text-xs text-neutral-500'>{t(`ghostDetail.timeline.${event.key}Hint`)}</p>
                <p className='mt-1 text-[11px] text-neutral-500'>
                  {t('ghostDetail.dateTime', {
                    date: date.format(new Date(`${event.date}T00:00:00Z`)),
                    time: event.time
                  })}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className='text-xs text-neutral-500'>{t('ghostDetail.noTimeline')}</p>
        )}
      </section>
      <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
        <h2 className='mb-4 flex items-center gap-2 text-sm font-bold'>
          <PencilLine size={17} aria-hidden='true' className='text-brand-600' />
          {t('ghostDetail.notesTitle')}
        </h2>
        <label className='block text-xs text-neutral-500'>
          <span>{t('ghostDetail.addNote')}</span>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('ghostDetail.addNote')}
            rows={3}
            maxLength={2000}
            className='mt-2 w-full resize-y rounded-lg border border-neutral-200 bg-brand-bg p-3 text-xs outline-brand-500'
          />
        </label>
        <div className='mt-2 flex items-center justify-between gap-3'>
          <p className='text-[11px] text-neutral-500'>{t('ghostDetail.draftHint')}</p>
          <button
            type='button'
            disabled
            title={t('ghostSeat.actionsUnavailable')}
            className='rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed'
          >
            {t('ghostDetail.save')}
          </button>
        </div>
        {detailed ? (
          <div className='mt-4 space-y-3'>
            {figmaDetail.notes.map((note) => (
              <article key={note.key} className='flex gap-2'>
                <span
                  aria-hidden='true'
                  className='flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600'
                >
                  {note.initials}
                </span>
                <div className='min-w-0 flex-1 rounded-lg border border-neutral-200 bg-brand-bg p-3'>
                  <p className='text-xs font-bold'>
                    {note.name}{' '}
                    <span className='font-normal text-neutral-500'>{t(`ghostDetail.notes.${note.key}Role`)}</span>
                  </p>
                  <p className='mt-1 text-[10px] text-neutral-500'>
                    {t('ghostDetail.dateTime', {
                      date: date.format(new Date(`${note.date}T00:00:00Z`)),
                      time: note.time
                    })}
                  </p>
                  <p className='mt-2 text-xs leading-relaxed text-neutral-500'>{t(`ghostDetail.notes.${note.key}`)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className='mt-4 text-xs text-neutral-500'>{t('ghostDetail.noNotes')}</p>
        )}
      </section>
    </div>
  )
}
