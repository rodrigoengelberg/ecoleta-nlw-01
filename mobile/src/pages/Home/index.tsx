import React, {useState, useEffect} from 'react'
import {Feather as Icon} from '@expo/vector-icons'
import {View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
import RNPickerSelect from "react-native-picker-select"
import api from '../../services/api'

interface UF {
  sigla: string
  nome: string
}

interface City {
  nome: string
}

interface IItem {
  label: string
  value: string
}

const Home = () => {
  const navigation = useNavigation()
  
  const [ufs, setUfs] = useState<IItem[]>([])
  const [selectedUf, setSelectedUf] = useState()
  const [cities, setCities] = useState<IItem[]>([])
  const [selectedCity, setSelectedCity] = useState()

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf: selectedUf,
      city: selectedCity,
    })
  }

  useEffect(() => {
    api.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufsIBGE = response.data.map((uf: UF) => ({
          label: uf.nome,
          value: uf.sigla,
        }));
        ufsIBGE.sort((a, b) => a.label.localeCompare(b.label))
        setUfs(ufsIBGE)
    })
  }, [])

  useEffect(() => {
    if (selectedUf !== '0') {
      api.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
        const citiesIBGE = response.data.map((city: City) => ({
          label: city.nome,
          value: city.nome,
        }))
        setCities(citiesIBGE.sort())
    })
    }
  }, [selectedUf])

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ImageBackground 
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{width: 274, height: 368}}
        >
          <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <View>
              <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
              <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forme eficiente.</Text>
            </View>
          </View>

          <View style={styles.footer}>

            <RNPickerSelect
              placeholder={{
                label: "Selecione um estado",
              }}
              style={{ ...pickerSelectStyles }}
              onValueChange={(value) => setSelectedUf(value)}
              items={ufs}
            />

            <RNPickerSelect
              placeholder={{
                label: "Selecione uma cidade",
              }}
              style={{ ...pickerSelectStyles }}
              onValueChange={(value) => setSelectedCity(value)}
              items={cities}
            />

            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color="#FFF" size={24}/>
                </Text>
              </View>
              <Text style={styles.buttonText}>
                ENTRAR
              </Text>
            </RectButton>
          </View>

        </ImageBackground>
      </KeyboardAvoidingView>
    )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }

})

export default Home