// dependencies
import React, { useState, useEffect } from 'react'
import './index.css'
import axios from 'axios'
import styled from 'styled-components/macro'
import { motion } from 'framer-motion'
import useSound from 'use-sound'
// components
import GlobalStyles from './GlobalStyles'
import Radio from './components/Radio'
import Champion from './components/Champion'
// assets
import pop from './assets/audio/pop.wav'

function App() {
  // state for app
  const [champions, setChampions] = useState(null)
  const [randomChampion, setRandomChampion] = useState(null)
  const [filteredList, setFilteredList] = useState(null)
  const [championId, setChampionId] = useState('')
  // state for wrapper
  const [degrees, setDegrees] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [allowOpacityAnimation, setAllowOpacityAnimation] = useState(0)
  // state for skins image
  const [skinList, setSkinList] = useState(null)
  const [currentSkin, setCurrentSkin] = useState(0)
  const [skinListIndex, setSkinListIndex] = useState(0)
  // state for radio
  const [selected, setSelected] = useState('All')

  const tagsArray = [
    'All',
    'Mage',
    'Assassin',
    'Tank',
    'Fighter',
    'Support',
    'Marksman',
  ]

  const [play] = useSound(pop)

  const variants = {
    spin: { rotate: degrees, transition: { ease: 'backInOut', duration: 1 } },
    grow: { scale: [0, 1] },
    disappear: {
      opacity: [1, 0, 1],
      transition: { ease: 'circOut', duration: 1 },
    },
    reappear: {
      opacity: [1, 0, 1],
      transition: { ease: 'circOut', duration: 1 },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios(
          'https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json'
        )
        setChampions(Object.values(response.data.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios(
          `https://ddragon.leagueoflegends.com/cdn/12.4.1/data/en_US/champion/${championId}.json`
        )
        setSkinList(response.data.data[championId].skins)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [championId])

  const handleRandomChampion = () => {
    setTimeout(() => {
      if (champions && filteredList) {
        let randomNum = Math.floor(Math.random() * filteredList.length)
        setRandomChampion(filteredList[randomNum])
        setChampionId(filteredList[randomNum].id)
      } else if (champions) {
        let randomNum = Math.floor(Math.random() * champions.length)
        setRandomChampion(champions[randomNum])
        setChampionId(champions[randomNum].id)
        // return console.log(champions[randomNum], randomNum, champions.length)
      }
    }, 300)
  }

  const handleSkinChange = () => {
    if (skinList[skinList.length - 1].num === currentSkin) {
      setCurrentSkin(0)
      setSkinListIndex(0)
    } else {
      setCurrentSkin(skinList[skinListIndex + 1].num)
      setSkinListIndex(skinListIndex + 1)
      console.log(currentSkin)
    }
  }

  const handleRadio = (tag) => {
    if (tag === 'All') {
      setFilteredList(null)
      setSelected(tag)
      console.log(tag)
    } else {
      let filteredChampions = champions.filter((value) =>
        value.tags.includes(tag)
      )
      console.log(tag)
      setFilteredList(filteredChampions)
      setSelected(tag)
    }
  }

  const opacityAnimation = () => {
    setAllowOpacityAnimation(allowOpacityAnimation + 1)
  }

  return (
    <OuterWrapper>
      <Nav>
        <HeadingOne>Random Champion Picker</HeadingOne>
      </Nav>
      {champions && randomChampion && (
        <Champion
          champion={randomChampion}
          skinNumber={currentSkin}
          handleSkinChange={handleSkinChange}
          showContent={showContent}
          variants={variants}
          allowOpacityAnimation={allowOpacityAnimation}
        />
      )}

      <Button
        whileHover={{
          scale: 1.1,
          transition: {
            type: 'spring',
            duration: 0.8,
            bounce: 0.8,
          },
        }}
        whileTap={{
          scale: 0.9,
          transition: {
            type: 'spring',
            duration: 0.8,
            bounce: 0.8,
          },
        }}
        onClick={() => {
          handleRandomChampion()
          setCurrentSkin(0)
          setSkinListIndex(0)
          if (!(champions && randomChampion)) {
            return play()
          }
          setDegrees(degrees + 360)
          setShowContent(!showContent)
          opacityAnimation()
        }}
        className='shadow-low'
      >
        Random Champion
      </Button>
      <InputWrapper>
        {tagsArray.map((value, index) => (
          <Radio
            key={index}
            value={value}
            handleRadio={handleRadio}
            selected={selected}
          />
        ))}
      </InputWrapper>
      <GlobalStyles />
    </OuterWrapper>
  )
}

const OuterWrapper = styled.main`
  position: relative;
  height: 100%;
  padding: 96px 32px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 48px;
  overflow: scroll;
`
const Nav = styled.nav`
  padding: 16px;
  position: fixed;
  text-align: center;
  top: 0;
  left: 0;
  right: 0;
`
const HeadingOne = styled.h1`
  font-size: 1.7rem;
`

const Button = styled(motion.button)`
  font-family: 'PT Sans';
  font-size: 1.1rem;
  max-width: 200px;
  color: white;
  background-color: hsl(131, 27%, 49%);
  border-style: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
`
const InputWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 16px;
`

export default App
