import { dictToArray } from '../../../../functions/objectUtils';
import { useAppSelector } from '../../../../redux/hooks'

const Teams = () => { // TODO 1 チームのメンバーなども含めて表示するためのコンポーネントを作成
  const teamsMap = useAppSelector(state => state.teamSlice.teams);
  const teams = dictToArray(teamsMap);

  return (
    teams.map(team => (
      <div>{team.teamName}</div>
    ))
  )
}

export default Teams