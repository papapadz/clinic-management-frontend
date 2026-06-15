globalThis.__timing__.logStart('Load chunks/build/useEncounter-C21kBNMf');import { ref } from 'vue';
import { u as useApi } from './useApi-BqLSQQg_.mjs';

function useEncounter() {
  const encounters = ref([]);
  const summary = ref(null);
  const meta = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const validationErrors = ref(null);
  const api = useApi();
  async function fetchPatientEncounters(patientId, params = {}) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath(`/patients/${patientId}/encounters`), { params });
      if (res.success) {
        encounters.value = res.data;
        meta.value = (_a = res.meta) != null ? _a : null;
      } else {
        error.value = res.message || "Failed to fetch encounters";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Failed to fetch encounters";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function fetchSummary(encounterId) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath(`/encounters/${encounterId}/summary`));
      if (res.success) {
        summary.value = res.data;
      } else {
        error.value = res.message || "Failed to fetch encounter summary";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Failed to fetch encounter summary";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function createEncounter(patientId, data) {
    return submit(api.tenantPath(`/patients/${patientId}/encounters`), "POST", {
      ...data,
      patient_id: patientId
    });
  }
  async function updateEncounter(encounterId, data) {
    return submit(api.tenantPath(`/encounters/${encounterId}`), "PATCH", data);
  }
  async function signEncounter(encounterId) {
    return submit(api.tenantPath(`/encounters/${encounterId}/sign`), "POST", {});
  }
  async function createLabOrder(data) {
    return submit(api.tenantPath("/lab/requests"), "POST", data);
  }
  async function createImagingOrder(data) {
    return submit(api.tenantPath("/imaging/requests"), "POST", data);
  }
  async function createPharmacyDispense(data) {
    return submit(api.tenantPath("/pharmacy/dispense"), "POST", data);
  }
  async function createBillingTransaction(data) {
    return submit(api.tenantPath("/billing/transactions"), "POST", data);
  }
  async function createMedicalRecord(data) {
    return submit(api.tenantPath("/records"), "POST", data);
  }
  async function submit(path, method, body) {
    saving.value = true;
    error.value = null;
    validationErrors.value = null;
    try {
      const res = await api.api(path, { method, body });
      if (!res.success) {
        validationErrors.value = res.errors;
        error.value = res.message || "Request failed";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Request failed";
      throw e;
    } finally {
      saving.value = false;
    }
  }
  return {
    encounters,
    summary,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchPatientEncounters,
    fetchSummary,
    createEncounter,
    updateEncounter,
    signEncounter,
    createLabOrder,
    createImagingOrder,
    createPharmacyDispense,
    createBillingTransaction,
    createMedicalRecord
  };
}

export { useEncounter as u };;globalThis.__timing__.logEnd('Load chunks/build/useEncounter-C21kBNMf');
//# sourceMappingURL=useEncounter-C21kBNMf.mjs.map
