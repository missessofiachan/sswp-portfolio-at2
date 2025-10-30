import { style } from '@vanilla-extract/css';

export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
});

export const modalContent = style({
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',

  selectors: {
    '&--small': {
      width: '400px',
    },
    '&--medium': {
      width: '600px',
    },
    '&--large': {
      width: '800px',
    },
  },
});

export const modalHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem',
  borderBottom: '1px solid #e0e0e0',

  selectors: {
    '& h2': {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
});

export const modalBody = style({
  padding: '1.5rem',
  flex: 1,
  overflow: 'auto',
});

export const modalFooter = style({
  padding: '1rem 1.5rem',
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
});

export const closeButton = style({
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  color: '#666',
  transition: 'color 0.2s',

  ':hover': {
    color: '#000',
  },

  ':focus-visible': {
    outline: '2px solid #0066cc',
    outlineOffset: '2px',
  },
});
