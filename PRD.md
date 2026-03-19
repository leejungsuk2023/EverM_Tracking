# EverM Clinic — 환자 팔로업 운영 대시보드
## Product Requirements Document (PRD)

**버전:** 2.0
**작성일:** 2026-03-18
**작성자:** EverM 운영팀
**상태:** 초안

---

## 목차

1. [개요](#1-개요)
2. [문제 정의](#2-문제-정의)
3. [목표 사용자](#3-목표-사용자)
4. [기능 요구사항](#4-기능-요구사항)
5. [데이터 모델](#5-데이터-모델)
6. [비기능 요구사항](#6-비기능-요구사항)
7. [기술 스택](#7-기술-스택)
8. [구현 로드맵](#8-구현-로드맵)
9. [성공 지표 (KPI)](#9-성공-지표-kpi)
10. [향후 확장 계획](#10-향후-확장-계획)

---

## 1. 개요

### 1.1 프로젝트 배경

EverM Clinic은 태국 환자를 대상으로 양악 수술(SSRO, IVRO), 브이라인, 안면 윤곽 등 성형외과 수술을 제공하는 한국 의료기관이다. 수술 유치부터 수술 후 관리까지 한국 병원(EverM), 한국 운영사(BBG), 태국 에이전시(Thai Agency) 3자가 협력하는 구조로 운영된다.

현재 모든 환자 정보와 운영 커뮤니케이션이 LINE 및 KakaoTalk 채팅에 분산되어 있어, **운영 매니저가 환자 팔로업 일정을 놓치거나 서류 누락을 제때 파악하지 못하는 문제**가 반복되고 있다. 이를 해결하기 위해 **운영 매니저 중심의 환자 팔로업 운영 대시보드**를 구축한다.

### 1.2 프로젝트 목적

- 12단계 환자 파이프라인의 실시간 가시성 확보
- 수술 관련 문서·결제·일정 정보의 단일 소스(Single Source of Truth) 구축
- 반복적인 수동 업무(서류 확인, 알림 발송, 일정 조율)의 자동화
- 수술 유형별(SSRO/IVRO) 팔로업 일정 자동 산출 및 추적

### 1.3 범위

**In-Scope**
- 환자 파이프라인 칸반 대시보드 (12단계)
- 서류 체크리스트 및 결제 상태 관리
- 수술 캘린더 및 통역사 스케줄링
- 수술 유형별 팔로업 일정 자동 생성·추적
- 자동 알림 시스템 (LINE 연동)
- 환자 상세 타임라인

**Out-of-Scope**
- RAG 기반 Q&A 챗봇 (향후 확장으로 이관)
- 전자의무기록(EMR) 시스템 연동
- 보험 청구 시스템
- 수술 동의서 전자 서명 (Phase 1 기준)
- 경영진 대시보드 (향후 확장으로 이관)

---

## 2. 문제 정의

### 2.1 현재 문제점 (As-Is 분석)

| # | 문제 영역 | 현상 | 영향 |
|---|-----------|------|------|
| 1 | 정보 분산 | 환자 정보가 LINE·KakaoTalk 여러 채팅방에 산재 | 정보 누락, 중복 확인 필요 |
| 2 | 단일 소스 부재 | 환자 현황을 파악하려면 여러 채팅방을 직접 확인 | 의사결정 지연, 오류 발생 |
| 3 | 수동 서류 체크 | 여권·항공권·호텔·K-ETA 수집 여부를 사람이 일일이 확인 | 서류 누락으로 수술 지연 리스크 |
| 4 | 일정 변경 미반영 | 수술일 변경 시 여러 채팅방을 수동으로 일일이 업데이트 | 커뮤니케이션 오류, 일정 충돌 |
| 5 | 환전/결제 비체계 | 현금 결제·환전 조율이 비공식 채팅으로 처리 | 금액 오류, 추적 불가 |
| 6 | 온보딩 체계 없음 | 신규 직원이 운영 프로세스를 파악할 공식 문서 없음 | 인수인계 비효율, 반복 실수 |
| 7 | 수술 유형별 차이 미반영 | SSRO/IVRO 팔로업 일정이 다르나 시스템에 반영 안 됨 | 팔로업 누락 리스크 |
| 8 | 운영 지표 불가시 | 월간 수술 건수·전환율·매출을 실시간으로 볼 수 없음 | 경영 판단 근거 부족 |

### 2.2 As-Is 프로세스 흐름

```
상담 요청 (LINE/KakaoTalk)
    ↓
태국 에이전시 → BBG 매니저 → 병원 원장
    ↓ (각 단계별로 채팅방 수동 업데이트)
서류 수집 체크 (수동)
    ↓
수술일 조율 (여러 채팅방 동시 공지)
    ↓
결제 조율 (현금, 환전 방식 협의)
    ↓
수술 진행
    ↓
팔로업 일정 알림 (수동 달력 확인 후 개별 연락)
```

---

## 3. 목표 사용자

### 3.1 단일 페르소나 — 운영 매니저 (Jeon 매니저 / Kevin)

- **역할:** 환자 파이프라인 전체 관리, 서류 수집 추적, 수술 일정 조율, 팔로업 관리
- **주요 니즈:**
  - 전체 환자 현황을 실시간으로 한눈에 파악
  - 서류 미제출·결제 미완료 등 미완료 항목 즉시 확인
  - 수술 유형별 팔로업 일정(SSRO vs IVRO) 자동 추적
  - 통역사 배정 및 수술실 일정 충돌 방지
- **주요 시나리오:**
  - "K.Wao 서류 다 냈나?" → 환자 카드에서 체크리스트 즉시 확인
  - "이번 주 팔로업 대상 환자가 누구지?" → 팔로업 대기 목록 자동 필터
  - "다음 주 수술 스케줄에 통역사 배정됐나?" → 캘린더 뷰에서 확인
  - "K.Ploy 수술일이 변경됐는데 팔로업 일정도 자동으로 바뀌나?" → 자동 재산출
- **기술 친숙도:** 중간 — 웹 대시보드 사용에 무리 없음
- **접근 환경:** 데스크톱 위주, 간헐적 모바일 확인

---

## 4. 기능 요구사항

### 4.1 환자 파이프라인 보드 (Patient Pipeline Board) — 핵심 기능

칸반(Kanban) 형태의 12단계 파이프라인 보드로, 운영 매니저가 모든 환자의 현황을 한눈에 파악한다.

**파이프라인 12단계:**

| 단계 | 명칭 | 기준 시점 |
|------|------|-----------|
| 1 | Consultation (상담) | D-60 ~ D-30 |
| 2 | Booking (예약 확정) | D-30 ~ D-14 |
| 3 | Document Collection (서류 수집) | D-14 ~ D-3 |
| 4 | Pre-op Prep (수술 전 준비) | D-7 ~ D-2 |
| 5 | Arrival & Health Check (입국 및 건강검진) | D-2 ~ D-1 |
| 6 | Surgery (수술) | D-Day |
| 7 | Hospitalization (입원) | D+1 ~ D+3 |
| 8 | Discharge (퇴원) | D+3 |
| 9 | Follow-up #1 (1차 팔로업) | D+7 ~ D+10 |
| 10 | Follow-up #2 (2차 팔로업) | D+21 |
| 11 | Follow-up #3 (3차 팔로업) | D+28 |
| 12 | Complete (완료) | D+30 이후 |

**환자 카드 표시 항목:**
- 환자명 (K-name), 국적, 수술 유형
- 서류 체크리스트: 여권 / 항공권(입) / 항공권(출) / 호텔 / K-ETA
- 결제 상태: 보증금 / 전액 / 환전 방식
- 수술일 카운트다운 (D-X)
- 다음 액션 항목
- 알림 플래그: 서류 지연 / 일정 충돌 / 통역사 미배정

**필터 및 검색:**
- 파이프라인 단계별 필터
- 서류 미완료 환자만 보기
- 팔로업 대기 환자만 보기
- 환자명(K-name) 검색

---

### 4.2 팔로업 관리 (Follow-up Management) — 핵심 기능

수술 유형에 따라 팔로업 일정이 다르므로, 시스템이 자동으로 팔로업 일정을 산출하고 추적한다.

#### 4.2.1 수술 유형별 팔로업 규칙

| 수술 유형 | F/U #1 | F/U #2 | F/U #3 | 비고 |
|-----------|--------|--------|--------|------|
| 2JAW_SSRO | D+7 | D+21 | D+28 | IMF 해제 후 일정 조정 가능 |
| 2JAW_IVRO | D+10 | D+21 | D+28 | SSRO 대비 회복 기간 상이 |
| VLINE | D+7 | D+14 | — | 팔로업 2회 |
| CONTOURING | D+7 | D+14 | — | 팔로업 2회 |
| ASO | D+7 | D+21 | D+28 | 양악과 유사 |

#### 4.2.2 팔로업 대시보드

- **오늘의 팔로업:** 오늘 팔로업 예정인 환자 목록
- **이번 주 팔로업:** 주간 팔로업 캘린더 뷰
- **지연 팔로업:** 예정일이 지났으나 완료 처리되지 않은 환자 하이라이트
- **팔로업 완료 처리:** 체크박스로 완료 처리, 메모 기록 가능

#### 4.2.3 수술일 변경 시 자동 재산출

- 수술일이 변경되면 모든 팔로업 일정이 자동으로 재산출
- 변경 전/후 일정 비교 표시
- 변경 이력 로그 기록

---

### 4.3 수술 캘린더 (Surgery Calendar)

- 주간/월간 캘린더 뷰 전환
- 수술실(OR) 스케줄 시각화
- 통역사 배정 현황
- 수술 일정 충돌 자동 감지
- 팔로업 일정 캘린더 통합 표시

---

### 4.4 환자 상세 (Patient Detail)

- 개별 환자 타임라인 (파이프라인 진행 이력)
- 서류 체크리스트 상태 확인·수정
- 결제 이력 (보증금, 잔금, 환전 방식)
- 팔로업 일정 (수술 유형별 자동 산출) + 완료 여부
- 메모/노트 기능 (팔로업 시 특이사항 기록)

---

### 4.5 자동 알림 시스템

#### 4.5.1 알림 트리거 정의

| 트리거 조건 | 기준 시점 | 알림 대상 | 조치 |
|-------------|-----------|-----------|------|
| E-ticket 미제출 | D-14 | 운영 매니저 | 환자에게 제출 요청 |
| 서류 미완료 | D-7 | 운영 매니저 | 수술 슬롯 보류 검토 |
| 환전 미조율 | D-7 | 운영 매니저 | 환전 방식 확정 |
| 입국 시간-건강검진 충돌 | D-3 | 운영 매니저 | 일정 재조율 |
| 팔로업 D-1 도래 | 각 팔로업 전날 | 운영 매니저 | 환자 방문 안내 준비 |
| 팔로업 지연 | 예정일 경과 | 운영 매니저 | 팔로업 미완료 처리 확인 |
| 수술일 변경 | 변경 발생 즉시 | 운영 매니저 | 팔로업 일정 재확인 |

#### 4.5.2 알림 채널

- **인앱 알림:** 대시보드 내 알림 센터 (1차 채널)
- **LINE Messaging API:** 외부 전달이 필요한 경우 (향후 확장)

---

## 5. 데이터 모델

### 5.1 환자 레코드 스키마 (Patient Record)

```sql
CREATE TABLE patients (
    patient_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    k_name              VARCHAR(100) NOT NULL,
    full_name           VARCHAR(200) NOT NULL,
    nationality         VARCHAR(50) DEFAULT 'TH',
    surgery_type        surgery_type_enum NOT NULL,
    surgery_date        DATE,
    pipeline_stage      pipeline_stage_enum NOT NULL DEFAULT 'CONSULTATION',

    -- Document checklist
    doc_passport        BOOLEAN DEFAULT FALSE,
    doc_flight_in       BOOLEAN DEFAULT FALSE,
    doc_flight_out      BOOLEAN DEFAULT FALSE,
    doc_hotel           BOOLEAN DEFAULT FALSE,
    doc_keta            BOOLEAN DEFAULT FALSE,

    -- Payment tracking
    deposit_paid        BOOLEAN DEFAULT FALSE,
    deposit_amount      NUMERIC(12, 2),
    total_surgery_cost  NUMERIC(12, 2),
    payment_status      payment_status_enum DEFAULT 'NONE',
    exchange_method     exchange_method_enum,

    -- Timeline
    arrival_date        DATE,
    discharge_date      DATE,

    -- Relationships
    interpreter_id      UUID REFERENCES interpreters(interpreter_id),

    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Enum: surgery types
CREATE TYPE surgery_type_enum AS ENUM (
    '2JAW_SSRO',
    '2JAW_IVRO',
    'VLINE',
    'CONTOURING',
    'ASO'
);

-- Enum: 12-stage pipeline
CREATE TYPE pipeline_stage_enum AS ENUM (
    'CONSULTATION',
    'BOOKING',
    'DOCUMENT_COLLECTION',
    'PREOP_PREP',
    'ARRIVAL_HEALTH_CHECK',
    'SURGERY',
    'HOSPITALIZATION',
    'DISCHARGE',
    'FOLLOWUP_1',
    'FOLLOWUP_2',
    'FOLLOWUP_3',
    'COMPLETE'
);

CREATE TYPE payment_status_enum AS ENUM ('NONE', 'PARTIAL', 'FULL');

CREATE TYPE exchange_method_enum AS ENUM (
    'SELF',
    'TEAM_ARRANGED',
    'CARD_PLUS_10PCT'
);
```

### 5.2 팔로업 테이블

```sql
CREATE TABLE followups (
    followup_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    followup_number SMALLINT NOT NULL,          -- 1, 2, 3
    scheduled_date  DATE NOT NULL,
    completed       BOOLEAN DEFAULT FALSE,
    completed_at    TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_followups_scheduled ON followups(scheduled_date, completed);
CREATE INDEX idx_followups_patient ON followups(patient_id);
```

### 5.3 연관 테이블

```sql
CREATE TABLE interpreters (
    interpreter_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    languages       TEXT[]
);

CREATE TABLE alerts (
    alert_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id),
    alert_type      VARCHAR(100) NOT NULL,
    triggered_at    TIMESTAMPTZ DEFAULT NOW(),
    resolved        BOOLEAN DEFAULT FALSE,
    resolved_at     TIMESTAMPTZ
);

CREATE TABLE pipeline_logs (
    log_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id),
    from_stage      pipeline_stage_enum,
    to_stage        pipeline_stage_enum NOT NULL,
    changed_at      TIMESTAMPTZ DEFAULT NOW(),
    note            TEXT
);
```

---

## 6. 비기능 요구사항

### 6.1 성능

| 항목 | 목표 |
|------|------|
| 대시보드 초기 로딩 | 3초 이내 |
| 동시 접속자 수 | 최소 10명 (운영팀 규모 기준) |
| 알림 표시 지연 | 트리거 발생 후 1분 이내 |
| 데이터베이스 쿼리 | 주요 쿼리 1초 이내 |

### 6.2 보안

- **인증:** Supabase Auth 기반 이메일/비밀번호 로그인
- **접근 제어:** 운영 매니저 단일 역할 기반 (향후 역할 확장 시 RBAC 도입)
- **데이터 암호화:** 전송 중 TLS 1.3, 저장 시 Supabase 기본 암호화
- **감사 로그:** 환자 데이터 수정 이력 기록 (pipeline_logs 테이블)

### 6.3 가용성 및 운영

- 목표 가용성: 99.5% (월간 기준)
- 정기 점검: 새벽 2~4시 (KST) 배포 권장
- 데이터 백업: Supabase 자동 백업 (일 1회)

---

## 7. 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| **프론트엔드** | Next.js + React + Tailwind CSS | SSR/SSG 지원, 빠른 UI 개발, Vercel 최적화 |
| **백엔드** | Next.js API Routes | 풀스택 단일 저장소, 별도 서버 불필요 |
| **데이터베이스** | Supabase (PostgreSQL) | 실시간 구독, Auth 내장, 무료 티어 활용 가능 |
| **호스팅** | Vercel (프론트엔드) + Supabase Cloud (DB) | 자동 배포, 글로벌 CDN |
| **인증** | Supabase Auth | 이메일/비밀번호 기반, JWT 토큰 |

### 7.1 시스템 아키텍처 다이어그램

```
[운영 매니저 브라우저]
        │
        ↓
[Next.js Frontend]          ← 대시보드 UI (칸반, 캘린더, 팔로업)
        │
        ↓ API Routes
[Next.js API]               ← 비즈니스 로직 (팔로업 자동 산출, 알림)
        │
        ↓
[Supabase PostgreSQL]       ← 환자 데이터, 팔로업, 알림
        │
        ↓ Realtime
[대시보드 자동 갱신]         ← Supabase Realtime 구독
```

---

## 8. 구현 로드맵

### Phase 1 — 기반 구축 (Week 1~2)

**목표:** 핵심 데이터 구조와 기본 파이프라인 가시화

| 작업 | 완료 조건 |
|------|-----------|
| Supabase 프로젝트 생성 및 DB 스키마 적용 | 환자, 팔로업, 알림 테이블 생성 완료 |
| Next.js 프로젝트 초기화 및 Vercel 배포 | 기본 앱 배포 확인 |
| 시드 데이터 입력 (현 환자 데이터) | 현재 파이프라인 환자 DB 등록 |
| 12단계 칸반 파이프라인 대시보드 | 칸반 보드 렌더링 + 환자 카드 표시 |
| 서류 체크리스트 UI | 체크리스트 상태 확인·수정 가능 |

### Phase 2 — 팔로업 핵심 기능 (Week 3~4)

**목표:** 수술 유형별 팔로업 자동 관리 구현

| 작업 | 완료 조건 |
|------|-----------|
| 팔로업 자동 생성 로직 | 수술일 입력 시 유형별 팔로업 일정 자동 생성 |
| 팔로업 대시보드 | 오늘/이번 주/지연 팔로업 목록 표시 |
| 수술일 변경 시 팔로업 재산출 | 변경 시 자동 재산출 + 이력 기록 |
| 환자 상세 페이지 | 타임라인, 서류, 결제, 팔로업 일정 표시 |

### Phase 3 — 캘린더 및 알림 (Week 5~6)

**목표:** 수술 캘린더와 인앱 알림 시스템 도입

| 작업 | 완료 조건 |
|------|-----------|
| 수술 캘린더 (주간/월간) | 수술 + 팔로업 일정 통합 캘린더 |
| 통역사 배정 기능 | 캘린더에서 통역사 배정·확인 가능 |
| 인앱 알림 시스템 | 7개 트리거 조건 알림 동작 |
| 결제 상태 관리 | 보증금/잔금/환전 방식 기록·조회 가능 |

### Phase 4 — 실시간 및 안정화 (Week 7~8)

**목표:** 실시간 업데이트 및 운영 안정화

| 작업 | 완료 조건 |
|------|-----------|
| Supabase Realtime 적용 | 대시보드 자동 갱신 |
| 팔로업 완료율 집계 | 팔로업 완료/지연 통계 표시 |
| 모바일 반응형 대응 | 태블릿/모바일에서 기본 사용 가능 |
| 운영 피드백 반영 | 운영 매니저 피드백 기반 UI/UX 개선 |

---

## 9. 성공 지표 (KPI)

### 9.1 팔로업 관리 효율성

| KPI | 현재 (As-Is) | 목표 (To-Be) | 측정 방법 |
|-----|-------------|-------------|-----------|
| 팔로업 누락 건수 | 미측정 (수동 추적) | 월 0건 | 지연 팔로업 카운트 |
| 팔로업 일정 확인 시간 | 10~20분 (채팅 검색) | 10초 이내 | 대시보드 팔로업 뷰 접근 시간 |
| 수술일 변경 → 팔로업 재조율 시간 | 30분 이상 (수동) | 즉시 (자동 재산출) | 시스템 자동 처리 |

### 9.2 운영 효율성

| KPI | 현재 (As-Is) | 목표 (To-Be) | 측정 방법 |
|-----|-------------|-------------|-----------|
| 서류 누락으로 인한 수술 지연 건수 | 월 X건 (미측정) | 월 0건 | 알림 발송 후 서류 완료율 |
| 환자 현황 파악 시간 | 15~30분 (채팅 수동 검색) | 1분 이내 | 대시보드 조회 시간 |
| 일정 충돌 발견 시간 | 사후 발견 | 사전 자동 감지 | 캘린더 충돌 감지 알림 |

---

## 10. 향후 확장 계획

### 10.1 단기 확장 (3~6개월)

- **RAG 기반 Q&A 챗봇:** 내부 직원용 한국어 Q&A, 환자용 태국어 FAQ 봇
- **경영진 대시보드:** 월간 수술 건수, 매출, 전환율 집계
- **LINE 알림 연동:** 인앱 알림 외 LINE Messaging API로 외부 알림 발송
- **태국 코디네이터 뷰:** 담당 환자 필터, 서류 수집 현황 전용 뷰

### 10.2 중기 확장 (6~12개월)

- **Omakase Dental 연동:** 수술 완료 환자의 교정 인계 데이터 자동 전달
- **다국 에이전시 확장:** 태국 외 베트남, 중국 등 다국적 에이전시 지원
- **전자 동의서:** 수술 동의서 디지털 서명 및 보관 기능

### 10.3 장기 비전 (12개월+)

- **타 의료기관 SaaS 확장:** EverM 운영 시스템을 타 성형외과 클리닉에 SaaS로 제공
- **EMR 연동:** 전자의무기록(EMR) 시스템과의 양방향 데이터 연동

---

## 부록

### A. 즉시 실행 항목 (Immediate Next Steps)

| # | 항목 | 기한 |
|---|------|------|
| 1 | Supabase 프로젝트 생성 및 DB 스키마 적용 | Week 1 |
| 2 | Next.js 프로젝트 초기화 및 Vercel 배포 설정 | Week 1 |
| 3 | 현재 환자 데이터 수동 입력 (시드 데이터) | Week 1 |
| 4 | 12단계 칸반 보드 UI 프로토타입 | Week 2 |
| 5 | 팔로업 자동 생성 로직 구현 | Week 2 |
| 6 | 칸반 보드 UI 프로토타입 피드백 수집 | Week 2 |

### B. 용어 정의

| 용어 | 설명 |
|------|------|
| SSRO | Sagittal Split Ramus Osteotomy — 시상분할골절단술 |
| IVRO | Intraoral Vertical Ramus Osteotomy — 구내수직하악지골절단술 |
| ASO | Anterior Segmental Osteotomy — 전방분절골절단술 |
| IMF | Intermaxillary Fixation — 악간고정 |
| K-ETA | Korea Electronic Travel Authorization — 한국 전자여행허가 |
| RLS | Row Level Security — 행 수준 보안 (Supabase 기능) |
| BBG | EverM의 한국 운영 파트너사 |
| K-name | 태국 환자의 한국식 호칭 (예: K.Wao, K.Ploy) |
| F/U | Follow-up — 수술 후 팔로업 진료 |

---

*본 문서는 EverM Clinic 운영팀의 내부 기획 문서로, 외부 공유 시 사전 승인이 필요합니다.*
