
-- SEED DATA FOR AI ORGANIZATIONAL ACTIVITIES
-- This file provides a comprehensive list of tasks for AI teams to map in RACI matrices.

-- Assumes org-1 exists from previous migration/simulation
INSERT INTO activities (id, organization_id, name, category, description)
VALUES
    -- Product Delivery
    (gen_random_uuid(), 'org-1', 'AI Feature PRD & Scoping', 'Product Delivery', 'Defining functional requirements and technical constraints for AI features.'),
    (gen_random_uuid(), 'org-1', 'AI ROI & Business Case Analysis', 'Product Delivery', 'Calculating the expected return on investment for model development.'),
    (gen_random_uuid(), 'org-1', 'User Research for Generative UI', 'Product Delivery', 'Gathering user feedback on AI-driven interfaces and workflows.'),
    (gen_random_uuid(), 'org-1', 'Competitive AI Benchmarking', 'Product Delivery', 'Analyzing competitor AI capabilities and market positioning.'),
    (gen_random_uuid(), 'org-1', 'AI Product Roadmap Definition', 'Product Delivery', 'Setting long-term milestones for AI capability integration.'),
    (gen_random_uuid(), 'org-1', 'Pricing & Token Monetization Strategy', 'Product Delivery', 'Designing how AI features are billed based on usage or value.'),

    -- Data Lifecycle
    (gen_random_uuid(), 'org-1', 'Data Acquisition & Sourcing', 'Data Lifecycle', 'Identifying and procuring internal or external datasets for training.'),
    (gen_random_uuid(), 'org-1', 'Data Pipeline Engineering (ETL)', 'Data Lifecycle', 'Building robust pipelines to move data from production to training environments.'),
    (gen_random_uuid(), 'org-1', 'Labeling & Annotation Quality Control', 'Data Lifecycle', 'Managing human-in-the-loop processes for data ground-truth.'),
    (gen_random_uuid(), 'org-1', 'Feature Store Management', 'Data Lifecycle', 'Maintaining a centralized repository for reusable machine learning features.'),
    (gen_random_uuid(), 'org-1', 'Data Privacy Masking/PII Detection', 'Data Lifecycle', 'Ensuring sensitive data is removed before model ingestion.'),
    (gen_random_uuid(), 'org-1', 'Vector Database Indexing & RAG Prep', 'Data Lifecycle', 'Preparing knowledge bases for Retrieval Augmented Generation.'),
    (gen_random_uuid(), 'org-1', 'Synthetic Data Generation', 'Data Lifecycle', 'Creating artificial datasets to augment rare edge cases.'),

    -- Model Development
    (gen_random_uuid(), 'org-1', 'Model Architecture Selection', 'Model Development', 'Choosing between base models (GPT-4, Llama-3, etc.) or custom architectures.'),
    (gen_random_uuid(), 'org-1', 'Fine-tuning & Instruction Tuning', 'Model Development', 'Specializing base models on domain-specific data.'),
    (gen_random_uuid(), 'org-1', 'Prompt Engineering & Prompt Management', 'Model Development', 'Optimizing system prompts and managing prompt versions.'),
    (gen_random_uuid(), 'org-1', 'Hyperparameter Optimization', 'Model Development', 'Automated tuning of model parameters for performance.'),
    (gen_random_uuid(), 'org-1', 'Offline Model Evaluation & Benchmarking', 'Model Development', 'Testing model performance against static test sets.'),
    (gen_random_uuid(), 'org-1', 'Model Quantization for Edge', 'Model Development', 'Compressing models for low-latency or low-compute environments.'),
    (gen_random_uuid(), 'org-1', 'RLHF / DPO Alignment', 'Model Development', 'Aligning model outputs with human preferences using feedback loops.'),

    -- Production Ops
    (gen_random_uuid(), 'org-1', 'MLOps CI/CD Pipeline Setup', 'Production Ops', 'Automating the deployment pipeline for new model versions.'),
    (gen_random_uuid(), 'org-1', 'Inference API Scaling & Load Balancing', 'Production Ops', 'Managing high-concurrency requests to production models.'),
    (gen_random_uuid(), 'org-1', 'Real-time Model Latency Monitoring', 'Production Ops', 'Tracking P99 latency and inference bottlenecks.'),
    (gen_random_uuid(), 'org-1', 'Data & Model Drift Detection', 'Production Ops', 'Monitoring for performance degradation over time.'),
    (gen_random_uuid(), 'org-1', 'GPU/Compute Resource Allocation', 'Production Ops', 'Optimizing hardware usage to minimize cloud costs.'),
    (gen_random_uuid(), 'org-1', 'A/B & Shadow Model Deployment', 'Production Ops', 'Testing new models against production traffic safely.'),
    (gen_random_uuid(), 'org-1', 'Incident Response for Model Failures', 'Production Ops', 'Managing "hallucination" crises or model downtime.'),

    -- Safety & Governance
    (gen_random_uuid(), 'org-1', 'Responsible AI Framework Definition', 'Safety & Governance', 'Setting the ethical boundaries for model behavior.'),
    (gen_random_uuid(), 'org-1', 'Model Bias & Fairness Auditing', 'Safety & Governance', 'Analyzing outputs for demographic or cultural bias.'),
    (gen_random_uuid(), 'org-1', 'Red Teaming & Jailbreak Testing', 'Safety & Governance', 'Aggressively testing the model for safety bypasses.'),
    (gen_random_uuid(), 'org-1', 'AI Regulatory Compliance (EU AI Act)', 'Safety & Governance', 'Ensuring models meet emerging legal requirements.'),
    (gen_random_uuid(), 'org-1', 'Explainability & Transparency Reporting', 'Safety & Governance', 'Generating documentation on how models arrive at decisions.'),
    (gen_random_uuid(), 'org-1', 'Adversarial Robustness Testing', 'Safety & Governance', 'Testing model resilience against malicious inputs.'),
    (gen_random_uuid(), 'org-1', 'Copyright & Intellectual Property Review', 'Safety & Governance', 'Verifying that training data does not violate IP laws.');
