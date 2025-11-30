export type IconProps = {
  variant:
    | 'setting'
    | 'add'
    | 'check'
    | 'cancel'
    | 'error'
    | 'loading'
    | 'clock'
    | 'upload'
    | 'copy'
    | 'paste'
    | 'edit'
    | 'login'
    | 'shield'
    | 'fileDownload';
  theme?: 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animation?: string;
  noDarkMode?: boolean;
};

export default function Icon({ variant, theme, size, animation, noDarkMode }: IconProps) {
  const iconClass = [
    'sv-icon',
    theme ? `sv-icon--${theme}` : '',
    size ? `sv-icon--${size}` : '',
    animation ? `sv-icon--${animation}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  switch (variant) {
    case 'setting':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path
            d='m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778Zm4.436.214Zm-3.86-1.6-.67-2.346c-.123-.429-.516-.725-.962-.725h-2.492c-.446 0-.838.296-.961.725l-.67 2.347c-.605.251-1.17.58-1.682.972l-2.37-.593c-.433-.108-.885.084-1.108.47L2.717 8.08c-.223.386-.163.874.147 1.195l1.698 1.755c-.04.318-.062.642-.062.971 0 .329.021.653.062.97l-1.698 1.756c-.31.32-.37.809-.147 1.195l1.246 2.158c.223.386.675.578 1.109.47l2.369-.593c.512.393 1.077.72 1.681.972l.67 2.347c.124.429.516.725.962.725h2.492c.446 0 .839-.296.961-.725l.67-2.347c.605-.251 1.17-.58 1.682-.972l2.37.593c.433.108.885-.084 1.109-.47l1.245-2.158c.223-.386.163-.874-.147-1.195l-1.698-1.755c.04-.318.062-.642.062-.971 0-.329-.021-.653-.062-.97l1.698-1.756c.31-.32.37-.809.147-1.195L20.038 5.92c-.224-.386-.676-.578-1.11-.47l-2.369.593c-.512-.393-1.077-.72-1.681-.972ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z'
            fillRule='evenodd'
          />
        </svg>
      );
    case 'add':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
        </svg>
      );

    case 'check':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
        </svg>
      );
    case 'cancel':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
        </svg>
      );

    case 'error':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' />
        </svg>
      );
    case 'loading':
      return (
        <svg
          className={`${iconClass} sv-spin-it`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z' />
        </svg>
      );
    case 'clock':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z' />
        </svg>
      );
    case 'upload':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z' />
        </svg>
      );
    case 'copy':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z' />
        </svg>
      );
    case 'paste':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z' />
        </svg>
      );
    case 'edit':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
        </svg>
      );
    case 'shield':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z' />
        </svg>
      );

    case 'login':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z' />
        </svg>
      );
    case 'fileDownload':
      return (
        <svg
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z' />
        </svg>
      );
  }
}
