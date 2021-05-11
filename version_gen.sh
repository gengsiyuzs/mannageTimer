THREEVERSION=$(GET http://scm.baidu.com/http/getMaxThreeversionVersionByCvspath.action?cvspath=baidu/ump/cmp-ui) || exit 1
LASTCHANGEDREVISION=$(git rev-parse --short HEAD)
SCMPF_MODULE_VERSION=${THREEVERSION}.${LASTCHANGEDREVISION}
