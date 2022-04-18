import { useRef, useEffect, useState } from 'react';

function isTextOverflow(element: HTMLElement, type: string) {
  if (type === 'width')
    return element.clientWidth < element.scrollWidth;

  if (type === 'height')
    return element.clientHeight < element.scrollHeight;
  return false;
}

type Option = {
  watch?: 'height' | 'width',
  key?: string | number
}

const defaultOption = {
  watch: 'height',
  key: '1224y9th98wyhtg98ys3'
};

function useTextOverflow(option?: Option) {

  const { watch, key } = { ...defaultOption, ...option };
  const ref = useRef<HTMLElement | undefined>(undefined);
  const [isOverflow, setOverflow] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const over = isTextOverflow(ref.current, watch);

      setOverflow(over);
    }
  }, [watch, key]);

  return [ref, isOverflow];

}

export default useTextOverflow;