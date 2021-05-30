from api.main_models.contract import BaseContract, TradeAgreement, ServiceAgreement, DistributionAgreement, AgentAgreement, \
    POAgreement, RentAgreement, OneTimeAgreement, InternationalAgreement, CustomerTemplateAgreement

from api.v1.serializers.contract import TradeCreateSerializer, ServiceCreateSerializer, \
    DistributionCreateSerializer, AgentCreateSerializer, POCreateSerializer, RentCreateSerializer, \
    OneTimeCreateSerializer, InternationalCreateSerializer, CustomerCreateSerializer, TradeGetSerializer, \
    ServiceGetSerializer, DistributionGetSerializer, AgentGetSerializer, POGetSerializer, RentGetSerializer, \
    OneTimeGetSerializer, InternationalGetSerializer, CustomerGetSerializer


contract_create_serializer = {
    BaseContract.Type.TRADE: TradeCreateSerializer,
    BaseContract.Type.SERVICE: ServiceCreateSerializer,
    BaseContract.Type.DISTRIBUTION: DistributionCreateSerializer,
    BaseContract.Type.AGENT: AgentCreateSerializer,
    BaseContract.Type.PO: POCreateSerializer,
    BaseContract.Type.RENT: RentCreateSerializer,
    BaseContract.Type.ONE_TIME: OneTimeCreateSerializer,
    BaseContract.Type.INTERNATIONAL: InternationalCreateSerializer,
    BaseContract.Type.CUSTOMER: CustomerCreateSerializer
}


contract_get_serializer = {
    BaseContract.Type.TRADE: TradeGetSerializer,
    BaseContract.Type.SERVICE: ServiceGetSerializer,
    BaseContract.Type.DISTRIBUTION: DistributionGetSerializer,
    BaseContract.Type.AGENT: AgentGetSerializer,
    BaseContract.Type.PO: POGetSerializer,
    BaseContract.Type.RENT: RentGetSerializer,
    BaseContract.Type.ONE_TIME: OneTimeGetSerializer,
    BaseContract.Type.INTERNATIONAL: InternationalGetSerializer,
    BaseContract.Type.CUSTOMER: CustomerGetSerializer
}


contract_map = {
    BaseContract.Type.TRADE: TradeAgreement,
    BaseContract.Type.SERVICE: ServiceAgreement,
    BaseContract.Type.DISTRIBUTION: DistributionAgreement,
    BaseContract.Type.AGENT: AgentAgreement,
    BaseContract.Type.PO: POAgreement,
    BaseContract.Type.RENT: RentAgreement,
    BaseContract.Type.ONE_TIME: OneTimeAgreement,
    BaseContract.Type.INTERNATIONAL: InternationalAgreement,
    BaseContract.Type.CUSTOMER: CustomerTemplateAgreement
}
