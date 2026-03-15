// src/hooks/useBooking.ts
import { useState, useCallback } from 'react';
import { useBookingStore } from '../store';

export const useBooking = () => {
  const { currentBooking, setCurrentBooking, confirmBooking } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const selectService = useCallback((serviceId: string, serviceName: string, price: string) => {
    setCurrentBooking({ service: serviceName, price });
  }, [setCurrentBooking]);

  const selectSlot = useCallback((date: string, time: string) => {
    setCurrentBooking({ date, time });
  }, [setCurrentBooking]);

  const setLocation = useCallback((location: string) => {
    setCurrentBooking({ location });
  }, [setCurrentBooking]);

  const submitBooking = useCallback(async (navigation: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    navigation.navigate('Payment');
  }, []);

  const submitPayment = useCallback(async (navigation: any) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    confirmBooking();
    setLoading(false);
    navigation.replace('Tracking');
  }, [confirmBooking]);

  return {
    currentBooking,
    loading,
    selectService,
    selectSlot,
    setLocation,
    submitBooking,
    submitPayment,
  };
};

// src/hooks/useTracking.ts
import { useEffect, useRef } from 'react';
import { useTrackingStore } from '../store';

export const useTracking = () => {
  const { isTracking, eta, distance, status, updateEta } = useTrackingStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate decreasing ETA
  useEffect(() => {
    if (!isTracking) return;

    intervalRef.current = setInterval(() => {
      const currentEta = useTrackingStore.getState().eta;
      if (currentEta > 1) {
        const newDist = (parseFloat(useTrackingStore.getState().distance) - 0.05).toFixed(1) + ' km';
        updateEta(currentEta - 1, newDist);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 30000); // every 30 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  return { isTracking, eta, distance, status };
};
