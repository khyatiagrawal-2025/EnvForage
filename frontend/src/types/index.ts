export interface PackageDef {
  name: string;
  version: string;
  is_core: boolean;
  cuda_variant_required: boolean;
}

export interface Profile {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  os_support: string[];
  cuda_required: boolean;
  python_versions: string[];
  cuda_versions: string[] | null;
  status: string;
  packages: PackageDef[];
  created_at?: string;
  updated_at?: string;
}

export interface ScriptGenerationRequest {
  profile_id: string;
  target_os: string;
  output_formats: string[];
  cuda_version?: string;
  python_version?: string;
}

export interface ScriptGenerationResponse {
  job_id: string;
  files_generated: string[];
  download_url: string;
}

export interface OSInfo {
  name: string;
  version: string;
  architecture: string;
  wsl_version: string | null;
}

export interface CPUInfo {
  brand: string;
  cores: number;
  threads: number;
}

export interface RAMInfo {
  total_gb: number;
  available_gb: number;
}

export interface GPUInfo {
  name: string;
  vram_gb: number;
  driver_version: string;
  index: number;
}

export interface CUDAInfo {
  version: string | null;
  toolkit_path: string | null;
  cudnn_version: string | null;
  nccl_version: string | null;
}

export interface PythonInfo {
  version: string;
  path: string;
  is_venv: boolean;
  venv_path: string | null;
  pip_version: string | null;
}

export interface DiagnosticReport {
  agent_version: string;
  os: OSInfo;
  cpu: CPUInfo;
  ram: RAMInfo;
  gpus: GPUInfo[];
  cuda: CUDAInfo;
  python_installations: PythonInfo[];
  active_python: PythonInfo | null;
}

export interface DiagnosticResponse {
  compatible: boolean;
  errors: string[];
  matched_profile: string | null;
}
