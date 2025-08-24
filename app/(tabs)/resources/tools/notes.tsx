import React from 'react';
import NotesScreen from '@/app/notes';
import { useHeaderTitleLiteral } from '@/hooks/useHeaderTitle';

export default function NotesToolScreen() {
  useHeaderTitleLiteral('Notes');
  
  return <NotesScreen />;
}