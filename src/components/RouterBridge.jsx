import { useParams } from 'react-router-dom'
import StoreFront from './StoreFront'

export default function RouterBridge(){
  const { slug } = useParams()
  return <StoreFront slug={slug} />
}
