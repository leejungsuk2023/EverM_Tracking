import { Patient, SURGERY_TYPE_LABELS } from '@/types/patient';
import { useLanguage } from '@/lib/i18n';

interface UpcomingSurgeriesProps {
  patients: Patient[];
  today: Date;
}

function docCount(patient: Patient): number {
  return [
    patient.doc_passport,
    patient.doc_flight_in,
    patient.doc_flight_out,
    patient.doc_hotel,
    patient.doc_keta,
  ].filter(Boolean).length;
}

export default function UpcomingSurgeries({ patients, today }: UpcomingSurgeriesProps) {
  const { t } = useLanguage();
  const todayMs = today.getTime();

  const upcoming = patients
    .filter((p) => {
      const surgeryMs = new Date(p.surgery_date).getTime();
      const diff = surgeryMs - todayMs;
      return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.surgery_date).getTime() - new Date(b.surgery_date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{t('dashboard.upcoming_surgeries')}</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400">{t('dashboard.no_upcoming_surgeries')}</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((patient) => {
            const surgeryDate = new Date(patient.surgery_date);
            const diffDays = Math.ceil(
              (surgeryDate.getTime() - todayMs) / (1000 * 60 * 60 * 24)
            );
            const docs = docCount(patient);

            return (
              <li
                key={patient.patient_id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{patient.k_name}</p>
                    <p className="text-xs text-gray-500">{patient.full_name}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {SURGERY_TYPE_LABELS[patient.surgery_type]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span
                    className={`text-sm font-bold ${
                      diffDays <= 3
                        ? 'text-red-600'
                        : diffDays <= 7
                        ? 'text-orange-500'
                        : 'text-gray-700'
                    }`}
                  >
                    D-{diffDays}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      docs === 5 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {t('dashboard.docs')} {docs}/5
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
