--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: checkboxes; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.checkboxes (
    id integer NOT NULL,
    label character varying(255) NOT NULL,
    is_completed boolean DEFAULT false,
    "stepId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.checkboxes OWNER TO setup_linux;

--
-- Name: checkboxes_id_seq; Type: SEQUENCE; Schema: public; Owner: setup_linux
--

CREATE SEQUENCE public.checkboxes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checkboxes_id_seq OWNER TO setup_linux;

--
-- Name: checkboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: setup_linux
--

ALTER SEQUENCE public.checkboxes_id_seq OWNED BY public.checkboxes.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.files (
    id integer NOT NULL,
    phase integer NOT NULL,
    step text NOT NULL,
    filename text NOT NULL,
    filepath text NOT NULL,
    upload_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.files OWNER TO setup_linux;

--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: setup_linux
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO setup_linux;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: setup_linux
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: learning_objectives; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.learning_objectives (
    id integer NOT NULL,
    phase character varying(255) NOT NULL,
    step integer NOT NULL,
    task integer NOT NULL,
    is_completed boolean DEFAULT false,
    date date,
    link character varying(255),
    comments text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.learning_objectives OWNER TO setup_linux;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    phase integer,
    step text,
    content text
);


ALTER TABLE public.notes OWNER TO setup_linux;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: setup_linux
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO setup_linux;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: setup_linux
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: phases; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.phases (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_completed boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.phases OWNER TO setup_linux;

--
-- Name: phases_id_seq; Type: SEQUENCE; Schema: public; Owner: setup_linux
--

CREATE SEQUENCE public.phases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phases_id_seq OWNER TO setup_linux;

--
-- Name: phases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: setup_linux
--

ALTER SEQUENCE public.phases_id_seq OWNED BY public.phases.id;


--
-- Name: steps; Type: TABLE; Schema: public; Owner: setup_linux
--

CREATE TABLE public.steps (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    is_completed boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "phaseId" integer
);


ALTER TABLE public.steps OWNER TO setup_linux;

--
-- Name: steps_id_seq; Type: SEQUENCE; Schema: public; Owner: setup_linux
--

CREATE SEQUENCE public.steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.steps_id_seq OWNER TO setup_linux;

--
-- Name: steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: setup_linux
--

ALTER SEQUENCE public.steps_id_seq OWNED BY public.steps.id;


--
-- Name: checkboxes id; Type: DEFAULT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.checkboxes ALTER COLUMN id SET DEFAULT nextval('public.checkboxes_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: phases id; Type: DEFAULT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.phases ALTER COLUMN id SET DEFAULT nextval('public.phases_id_seq'::regclass);


--
-- Name: steps id; Type: DEFAULT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.steps ALTER COLUMN id SET DEFAULT nextval('public.steps_id_seq'::regclass);


--
-- Data for Name: checkboxes; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.checkboxes (id, label, is_completed, "stepId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.files (id, phase, step, filename, filepath, upload_date) FROM stdin;
\.


--
-- Data for Name: learning_objectives; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.learning_objectives (id, phase, step, task, is_completed, date, link, comments, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.notes (id, phase, step, content) FROM stdin;
38	1	1	Auto-generated note
49	1	Step 5: Pre-Deployment Verification	
50	1	5	Auto-generated note
52	2	1	Auto-generated note
54	3	Step 1: User Logins and Experience	
55	3	Step 2: Home Directories and OneDrive Access	
56	3	Step 3: Performance and Reliability Checks	
57	3	Step 4: Feedback and Issue Collection	
58	3	Step 5: Refinements and Minor Adjustments	
46	1	Step 3: Debian Installation via PXE (192.168.8.3)	Using root password 'exhall2024' while testing. Must be changed before deployment. Could use Ansible to complete this.
30	1	Step 1: Network Isolation (VLAN/Subnet)	Will be using a computer as a router between the Linux network and the rest of the school network to keep school network safe.
47	1	Step 4: Configuration Management (Ansible)	Use to set root passwords before deployment.
32	1	Step 2: Central File Server (Samba/Winbind)	
\.


--
-- Data for Name: phases; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.phases (id, name, is_completed, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: steps; Type: TABLE DATA; Schema: public; Owner: setup_linux
--

COPY public.steps (id, name, is_completed, "createdAt", "updatedAt", "phaseId") FROM stdin;
\.


--
-- Name: checkboxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: setup_linux
--

SELECT pg_catalog.setval('public.checkboxes_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: setup_linux
--

SELECT pg_catalog.setval('public.files_id_seq', 12, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: setup_linux
--

SELECT pg_catalog.setval('public.notes_id_seq', 91, true);


--
-- Name: phases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: setup_linux
--

SELECT pg_catalog.setval('public.phases_id_seq', 1, false);


--
-- Name: steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: setup_linux
--

SELECT pg_catalog.setval('public.steps_id_seq', 1, false);


--
-- Name: checkboxes checkboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.checkboxes
    ADD CONSTRAINT checkboxes_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: learning_objectives learning_objectives_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.learning_objectives
    ADD CONSTRAINT learning_objectives_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: phases phases_name_key; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.phases
    ADD CONSTRAINT phases_name_key UNIQUE (name);


--
-- Name: phases phases_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.phases
    ADD CONSTRAINT phases_pkey PRIMARY KEY (id);


--
-- Name: steps steps_pkey; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.steps
    ADD CONSTRAINT steps_pkey PRIMARY KEY (id);


--
-- Name: notes unique_note; Type: CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT unique_note UNIQUE (phase, step);


--
-- Name: checkboxes checkboxes_stepId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.checkboxes
    ADD CONSTRAINT "checkboxes_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES public.steps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_phase_step_fkey; Type: FK CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_phase_step_fkey FOREIGN KEY (phase, step) REFERENCES public.notes(phase, step) ON DELETE CASCADE;


--
-- Name: steps steps_phaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: setup_linux
--

ALTER TABLE ONLY public.steps
    ADD CONSTRAINT "steps_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES public.phases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

