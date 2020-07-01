import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react';
import SessionView from '../components/SessionView';
import styles from "./index.module.css";

const StartSessionView = (props) => {
  const { nameRef, setSessionState } = props;
  const [userName, setUserName] = useState<String>('');

  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  });

  const handleChange = (e) => {
    localStorage.setItem('userName', e.target.value);
    setUserName(e.target.value);
  }

  return (<form className={styles.joinForm} onSubmit={() => setSessionState(true)}>
    <input required placeholder='Name' value={userName} onChange={handleChange} className={styles.nameInput} type="text" name={"screenName"} ref={nameRef} />
    <button className={styles.joinButton}>Join</button>
  </form>);
};

const IndexPage = () => {

  const nameRef = useRef<HTMLInputElement>(null);
  const [sessionStatus, setSessionState] = useState<boolean>(false);
  
  return (
    <Layout title="TK Hands APP">
      {!sessionStatus 
        ? <StartSessionView nameRef={nameRef} setSessionState={setSessionState} /> 
        : <SessionView name={nameRef.current?.value || ""} />}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(IndexPage), {
  ssr: false
})
