export type IconProps = {
  variant:
    | 'setting'
    | 'add'
    | 'back'
    | 'link'
    | 'delete'
    | 'check'
    | 'cancel'
    | 'error'
    | 'report'
    | 'loading'
    | 'clock'
    | 'upload'
    | 'copy'
    | 'paste'
    | 'edit'
    | 'login'
    | 'logout'
    | 'shield'
    | 'newUser'
    | 'options'
    | 'badge'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
          focusable='false'
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
    case 'newUser':
      return (
        <svg
          focusable='false'
          className={`${iconClass}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
          width='24px'
          height='24px'
          aria-hidden='true'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path d='M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z' />
        </svg>
      );
    case 'badge':
      return (
        <svg
          focusable='false'
          className={`${iconClass}`}
          width='24px'
          height='24px'
          viewBox='0 0 24px 24px'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <g clipPath='url(#clip0_334_32)'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M12.8243 4.58755C13.54 5.14813 14 6.02035 14 7C14 7.97968 13.54 8.85194 12.8242 9.41255C12.9339 10.315 12.6424 11.2571 11.9497 11.9498C11.257 12.6425 10.3149 12.934 9.41246 12.8243C8.85185 13.54 7.97965 14 7 14C6.02033 14 5.1481 13.54 4.58752 12.8242C3.68498 12.934 2.74296 12.6424 2.05023 11.9497C1.3575 11.2571 1.06601 10.315 1.17575 9.41246C0.459986 8.85185 0 7.97965 0 7C0 6.02033 0.460001 5.1481 1.17579 4.58752C1.06605 3.68498 1.35754 2.74296 2.05026 2.05023C2.74299 1.3575 3.68502 1.06601 4.58755 1.17575C5.14813 0.459986 6.02035 0 7 0C7.97968 0 8.85194 0.460015 9.41255 1.17582C10.315 1.06608 11.2571 1.35758 11.9498 2.0503C12.6425 2.74302 12.934 3.68503 12.8243 4.58755ZM10.6812 5.43122L9.44379 4.19378L6.125 7.51257L4.55622 5.94378L3.31878 7.18122L6.125 9.98742L10.6812 5.43122Z'
            />
          </g>
          <defs>
            <clipPath id='clip0_334_32'>
              <rect width='14' height='14' fill='white' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'options':
      return (
        <svg
          focusable='false'
          className={`${iconClass}`}
          width='24px'
          height='24px'
          viewBox='0 0 24px 24px'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          data-no-dark-mode={noDarkMode ? '' : undefined}
        >
          <path
            d='M12.5 14.625C13.0753 14.625 13.5417 14.1213 13.5417 13.5C13.5417 12.8787 13.0753 12.375 12.5 12.375C11.9247 12.375 11.4584 12.8787 11.4584 13.5C11.4584 14.1213 11.9247 14.625 12.5 14.625Z'
            stroke='#757575'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.5 6.75C13.0753 6.75 13.5417 6.24632 13.5417 5.625C13.5417 5.00368 13.0753 4.5 12.5 4.5C11.9247 4.5 11.4584 5.00368 11.4584 5.625C11.4584 6.24632 11.9247 6.75 12.5 6.75Z'
            stroke='#757575'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.5 22.5C13.0753 22.5 13.5417 21.9963 13.5417 21.375C13.5417 20.7537 13.0753 20.25 12.5 20.25C11.9247 20.25 11.4584 20.7537 11.4584 21.375C11.4584 21.9963 11.9247 22.5 12.5 22.5Z'
            stroke='#757575'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'report':
      return (
        <svg
          focusable='false'
          className={`${iconClass}`}
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M10 13.75C10.2083 13.75 10.3854 13.6771 10.5312 13.5312C10.6771 13.3854 10.75 13.2083 10.75 13C10.75 12.7917 10.6771 12.6146 10.5312 12.4688C10.3854 12.3229 10.2083 12.25 10 12.25C9.79167 12.25 9.61458 12.3229 9.46875 12.4688C9.32292 12.6146 9.25 12.7917 9.25 13C9.25 13.2083 9.32292 13.3854 9.46875 13.5312C9.61458 13.6771 9.79167 13.75 10 13.75ZM9.25 11H10.75V6H9.25V11ZM7.10417 17L3 12.875V7.10417L7.10417 3H12.8958L17 7.10417V12.8958L12.875 17H7.10417ZM7.72917 15.5H12.2708L15.5 12.2708V7.72917L12.25 4.5H7.72917L4.5 7.72917V12.2708L7.72917 15.5Z' />
        </svg>
      );
    case 'link':
      return (
        <svg
          className={`${iconClass}`}
          focusable='false'
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M6.72909 17.0208C5.70131 17.0208 4.82631 16.6562 4.10409 15.9271C3.38186 15.1979 3.02075 14.3194 3.02075 13.2917C3.02075 12.8056 3.1145 12.3333 3.302 11.875C3.4895 11.4167 3.75686 11.0139 4.10409 10.6667L6.85409 7.91667L7.91659 8.97917L5.16659 11.7292C4.95825 11.9375 4.79506 12.1771 4.677 12.4479C4.55895 12.7188 4.49992 13 4.49992 13.2917C4.49992 13.9167 4.7152 14.441 5.14575 14.8646C5.57631 15.2882 6.10409 15.5 6.72909 15.5C7.02075 15.5 7.29853 15.4444 7.56242 15.3333C7.82631 15.2222 8.06242 15.0625 8.27075 14.8542L11.0416 12.1042L12.1041 13.1667L9.33325 15.9167C8.98603 16.2778 8.58672 16.5521 8.13534 16.7396C7.68395 16.9271 7.2152 17.0208 6.72909 17.0208ZM8.56242 12.5L7.49992 11.4375L11.4374 7.5L12.4999 8.5625L8.56242 12.5ZM13.1458 12.0833L12.0833 11.0208L14.8541 8.27083C15.0624 8.07639 15.2187 7.84375 15.3228 7.57292C15.427 7.30208 15.4791 7.02778 15.4791 6.75C15.4791 6.125 15.2673 5.59722 14.8437 5.16667C14.4201 4.73611 13.8958 4.52083 13.2708 4.52083C12.9791 4.52083 12.7013 4.57292 12.4374 4.67708C12.1735 4.78125 11.9374 4.9375 11.7291 5.14583L8.97909 7.91667L7.91659 6.85417L10.6666 4.08333C11.0138 3.72222 11.4166 3.45139 11.8749 3.27083C12.3333 3.09028 12.8055 3 13.2916 3C14.3194 3 15.1909 3.36111 15.9062 4.08333C16.6214 4.80556 16.9791 5.6875 16.9791 6.72917C16.9791 7.21528 16.8888 7.68403 16.7083 8.13542C16.5277 8.58681 16.2638 8.98611 15.9166 9.33333L13.1458 12.0833Z' />
        </svg>
      );
    case 'delete':
      return (
        <svg
          className={`${iconClass}`}
          focusable='false'
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M6.5 17C6.0875 17 5.73437 16.8531 5.44062 16.5594C5.14687 16.2656 5 15.9125 5 15.5V5.5H4V4H8V3H12V4H16V5.5H15V15.491C15 15.9137 14.8531 16.2708 14.5594 16.5625C14.2656 16.8542 13.9125 17 13.5 17H6.5ZM13.5 5.5H6.5V15.5H13.5V5.5ZM8 14H9.5V7H8V14ZM10.5 14H12V7H10.5V14Z' />
        </svg>
      );
    case 'back':
      return (
        <svg
          focusable='false'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z' fill='#1D1B20' />
        </svg>
      );
    case 'logout':
      return (
        <svg height='24' viewBox='0 0 24 24' width='24' focusable='false'>
          <path d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z' />
          <path d='M0 0h24v24H0z' fill='none' />
        </svg>
      );
  }
}
