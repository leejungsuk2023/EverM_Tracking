'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { SURGERY_WORKFLOWS, IVRO_VS_SSRO } from '@/data/workflow';

const SURGERY_TABS = [
  { key: '2JAW_SSRO', label: 'SSRO' },
  { key: '2JAW_IVRO', label: 'IVRO' },
  { key: 'VLINE', label: 'V-Line' },
  { key: 'CONTOURING', label: 'Contouring' },
  { key: 'ASO', label: 'ASO' },
] as const;

type SurgeryKey = typeof SURGERY_TABS[number]['key'];

export default function WorkflowGuide() {
  const { t, lang } = useLanguage();
  const [selectedSurgery, setSelectedSurgery] = useState<SurgeryKey>('2JAW_SSRO');

  const workflow = SURGERY_WORKFLOWS[selectedSurgery];
  const isKo = lang === 'ko';
  const showComparison = selectedSurgery === '2JAW_SSRO' || selectedSurgery === '2JAW_IVRO';

  return (
    <div className="space-y-6">
      {/* Surgery type selector */}
      <div>
        <p className="text-xs text-gray-500 mb-2">{t('workflow.select_surgery')}</p>
        <div className="flex gap-2 overflow-x-auto flex-nowrap sm:flex-wrap pb-1">
          {SURGERY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedSurgery(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedSurgery === tab.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow title card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
        <h2 className="text-base font-semibold text-blue-800">
          {isKo ? workflow.titleKo : workflow.title}
        </h2>
      </div>

      {/* Current Practice */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">{t('workflow.current_practice')}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {workflow.steps.map((step) => (
            <div key={step.step} className="flex gap-4 px-5 py-3.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                {step.step}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">
                {isKo ? step.descriptionKo : step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Post-op Precautions Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">{t('workflow.postop_precautions')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 w-36">
                  {t('workflow.timepoint')}
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">
                  {t('workflow.key_points')}
                </th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 w-32">
                  {t('calendar.interpreter')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workflow.postopPrecautions.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">
                      {isKo ? row.timepointKo : row.timepoint}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-xs text-gray-600 leading-relaxed">
                      {isKo ? row.descriptionKo : row.description}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    {row.interpreterRequired ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        {t('workflow.interpreter_required')}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                        {t('workflow.as_needed')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IVRO vs SSRO Comparison Table */}
      {showComparison && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">{t('workflow.ivro_vs_ssro')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {IVRO_VS_SSRO.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-2.5 text-xs font-semibold text-gray-500 ${i === 0 ? 'text-left' : 'text-center'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {IVRO_VS_SSRO.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-gray-50 transition-colors ${
                      (selectedSurgery === '2JAW_IVRO' && i === 0) ||
                      (selectedSurgery === '2JAW_SSRO' && i === 1)
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">
                      {isKo ? row.label.ko : row.label.en}
                    </td>
                    <td className={`px-4 py-3 text-xs text-center ${selectedSurgery === '2JAW_IVRO' ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
                      {isKo ? row.ivro.ko : row.ivro.en}
                    </td>
                    <td className={`px-4 py-3 text-xs text-center ${selectedSurgery === '2JAW_SSRO' ? 'font-semibold text-blue-700' : 'text-gray-600'}`}>
                      {isKo ? row.ssro.ko : row.ssro.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
