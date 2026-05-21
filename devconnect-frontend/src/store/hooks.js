// src/store/hooks.js
// Typed versions of useDispatch and useSelector
// WHY: avoids importing store type everywhere
// Cleaner than using raw useDispatch/useSelector

import { useDispatch, useSelector } from 'react-redux';

// Use these instead of plain useDispatch/useSelector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Usage in components:
// const dispatch  = useAppDispatch();
// const jobs      = useAppSelector(state => state.jobs.jobs);
// const user      = useAppSelector(state => state.auth.user);