const generateProspectSource = (source, query) => {
  const motopiaSource = query.motopia_source || '';
  const motopiaMedium = query.motopia_medium || '';
  const motopiaCampaign = query.motopia_campaign || '';
  const params = [motopiaSource, motopiaMedium, motopiaCampaign].filter(param => !!param).join('-');
  return params ? `${source} [${params}]` : source;
};

export default generateProspectSource;
