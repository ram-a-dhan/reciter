import { useEffect } from "react";
import { useListenerStore } from "@/stores/listener";
import {
  initListenerInstance,
  startListenerTranscription,
  stopListenerTranscription,
  releaseListenerInstance,
} from "@/utils/listener";

export default function useListener() {
  const isListening = useListenerStore((state) => state.isListening);
  const setIsListening = useListenerStore((state) => state.setIsListening);

  useEffect(() => {
    initListenerInstance();
    return () => {
      releaseListenerInstance();
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startListenerTranscription({
        onText: (text) => {
          // TODO: verse matcher
          console.log(text);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    } else {
      stopListenerTranscription();
    }
  }, [isListening]);
}
