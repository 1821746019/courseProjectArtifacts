if [[ -z $1 ]];then
  echo "Please provide an element as an argument."
  exit 0;
fi
PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"
ATOMIC_NUMBER=""
SYMBOL=""
NAME=""
if [[ $1 =~ ^[0-9]+$ ]];then
  ATOMIC_NUMBER=$1
elif [[ $1 =~ ^[A-Z][a-z]?$ ]];then
  SYMBOL=$1
else
  NAME=$1
fi

echo $ATOMIC_NUMBER $SYMBOL $NAME

if [[ ! -z $SYMBOL ]];then
  ATOMIC_NUMBER=$($PSQL "SELECT ATOMIC_NUMBER FROM elements WHERE symbol='$SYMBOL';")
elif [[ ! -z $NAME ]];then
  ATOMIC_NUMBER=$($PSQL "SELECT ATOMIC_NUMBER FROM elements WHERE name='$NAME';")
fi

if [[ -z $ATOMIC_NUMBER ]];then
  echo  "I could not find that element in the database."
  exit 0;
fi


QUERY_RESULT=$($PSQL "SELECT symbol,name FROM elements WHERE atomic_number=$ATOMIC_NUMBER ")
if [[ -z $QUERY_RESULT ]];then
  echo  "I could not find that element in the database."
  exit 0;
fi
IFS='|' read SYMBOL NAME <<<"$QUERY_RESULT"
PROPS_QUERY_RESULT=$($PSQL "SELECT types.type,atomic_mass,melting_point_celsius,boiling_point_celsius FROM properties INNER JOIN types USING(type_id) WHERE atomic_number=$ATOMIC_NUMBER")
IFS='|' read TYPE MASS MELTING_POINT BOILING_POINT <<<$PROPS_QUERY_RESULT

echo   "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."