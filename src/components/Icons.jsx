/* Icônes au trait fin (1,2 px), héritent de la couleur du texte. */
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function HeartIcon({ filled = false, ...props }) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 20.2s-7.6-4.5-7.6-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.6 2.5c0 5.6-7.6 10.1-7.6 10.1Z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

export function BagIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 8.5h13l-1 11.5h-11l-1-11.5Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}
