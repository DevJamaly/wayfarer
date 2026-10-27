function Flag({
  countryCode,
  country,
}: {
  countryCode: string;
  country: string;
}) {
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
      alt={`Flag of ${country}`}
      width={20}
    />
  );
}

export default Flag;
