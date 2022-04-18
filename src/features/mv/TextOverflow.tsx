import * as React from 'react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import clsx from 'clsx';
import useTextOverflow from '../../hooks/useTextOverflow';

type TextOverflow = {
  children: ReactNode
  className?: string
  mvId: number
}


function TextOverflow(props: TextOverflow) {

  const { children, mvId } = props;

  const [ref, isOverflow] = useTextOverflow({ key: mvId });

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [mvId]);

  const handleTextOverflow = useCallback(() => {
    setShow(prevState => !prevState);
  }, []);

  const classname = clsx({ 'nowrap3': !show });


  return (

    <>
      {/*// @ts-ignore*/}
      <div ref={ref} className={classname}>
        {children}
      </div>
      {
        isOverflow && (
          <Button onClick={handleTextOverflow} sx={{ mt: 1 }}>{show ? '收起' : '展开'}</Button>
        )
      }
    </>
  );
}

export default TextOverflow;