"use client";

import { useActionState, useState } from "react";

import {
  saveStation,
  type StationAdminActionState,
} from "@/src/features/station-admin/server/station-admin.actions";
import styles from "./StationJsonEditor.module.css";

const initialState: StationAdminActionState = { success: false, message: "" };

export default function StationJsonEditor({
  initialStation,
  isNew,
}: {
  initialStation: Record<string, unknown>;
  isNew: boolean;
}) {
  const [stationJson, setStationJson] = useState(() =>
    JSON.stringify(initialStation, null, 2),
  );
  const [state, formAction, isPending] = useActionState(saveStation, initialState);

  return (
    <section className={styles.editor}>
      <div className={styles.editorHeader}>
        <h2>{isNew ? "建立新車站" : "編輯車站"}</h2>
        <p>
          {isNew
            ? "找不到這個 id，請填寫資料後建立。"
            : "編輯完成後儲存，系統會以 id 覆寫該筆資料。"}
        </p>
      </div>
      <form action={formAction} className={styles.form}>
        <label htmlFor="station-json">車站資料 JSON</label>
        <textarea
          id="station-json"
          name="stationJson"
          value={stationJson}
          onChange={(event) => setStationJson(event.target.value)}
          spellCheck={false}
          className={styles.textarea}
        />
        {state.message && (
          <p className={state.success ? styles.successMessage : styles.errorMessage}>
            {state.message}
          </p>
        )}
        <button type="submit" className={styles.saveButton} disabled={isPending}>
          {isPending ? "儲存中…" : isNew ? "建立車站" : "儲存變更"}
        </button>
      </form>
    </section>
  );
}
